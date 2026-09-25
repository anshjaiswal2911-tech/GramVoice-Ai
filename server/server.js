import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Production-ready CORS configuration
const allowedOrigins = (process.env.FRONTEND_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);

      // If allowedOrigins includes '*' or specific origin match
      if (
        allowedOrigins.length === 0 ||
        allowedOrigins.includes("*") ||
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app") ||
        origin.includes("localhost") ||
        origin.includes("127.0.0.1")
      ) {
        return callback(null, true);
      }

      // Default allow for seamless deployment access
      return callback(null, true);
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

const SYSTEM_INSTRUCTION = `
You are GramVoice AI.

You are an AI business assistant for Indian rural entrepreneurs
and small business owners.

Help users with:

- Business registration
- MSME / Udyam registration
- GST registration
- Government schemes
- PM Mudra Loan
- Business loans
- Startup ideas
- Marketing
- WhatsApp marketing
- Digital payments
- Business planning
- Finding mentors

Language rules:
- Hindi user -> Hindi/Hinglish
- English user -> English
- Mixed language -> natural Hinglish

Voice Transcription & Speech-to-Text Rules:
- User queries often come from mobile speech dictation (STT) and may contain phonetic typos, timestamps or misheard numbers (for example: "1:04 business" or "ek char business" meaning "ek achha business", "mudra lon", "gst number", etc.).
- Intelligently understand the user's intended business question from the voice context and give a direct, friendly, and practical answer.

Keep answers simple, concise, friendly and practical.

Give step-by-step guidance whenever possible.

Do not invent government rules, eligibility,
fees or official information.
`;

const FAST_MODELS = [
  "gemini-3.5-flash-lite",
  "gemini-3.1-flash-lite",
  "gemini-3.8-flash",
  "gemini-3.5-flash",
];

async function generateAIResponse(message, apiKey) {
  let lastError = null;

  for (const model of FAST_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: SYSTEM_INSTRUCTION }],
          },
          contents: [
            {
              role: "user",
              parts: [{ text: message }],
            },
          ],
          generationConfig: {
            maxOutputTokens: 500,
            temperature: 0.7,
          },
        }),
      });

      const data = await res.json();

      if (res.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      }

      console.warn(`[Model ${model} Warning]:`, data.error?.message || "No text returned");
      lastError = new Error(data.error?.message || `Model ${model} failed with status ${res.status}`);
    } catch (err) {
      console.warn(`[Model ${model} Error]:`, err.message);
      lastError = err;
    }
  }

  throw lastError || new Error("All AI models are currently busy. Please try again in a few seconds.");
}

app.get("/api/health", (req, res) => {
  const keyConfigured = Boolean((process.env.GEMINI_API_KEY || "").trim());
  res.json({
    success: true,
    message: "GramVoice AI backend is running",
    apiKeyConfigured: keyConfigured,
  });
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: "Message is required",
      });
    }

    const apiKey = (process.env.GEMINI_API_KEY || "").trim().replace(/^["']|["']$/g, "");
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: "GEMINI_API_KEY is not configured on the server.",
      });
    }

    console.log("User:", message);

    const reply = await generateAIResponse(message, apiKey);

    console.log("AI:", reply);

    res.json({
      success: true,
      reply: reply,
    });

  } catch (error) {
    console.error("Gemini Error:", error);

    res.status(500).json({
      success: false,
      error: error.message || "AI request failed",
    });
  }
});

app.listen(PORT, () => {
  console.log("");
  console.log("======================================");
  console.log("🚀 GramVoice AI Backend Started");
  console.log(`🌐 http://localhost:${PORT}`);
  console.log("======================================");
  console.log("");

  // Keep Render server awake automatically
  const renderUrl = process.env.RENDER_EXTERNAL_URL || "https://gramvoice-ai.onrender.com";
  setInterval(() => {
    fetch(`${renderUrl}/api/health`).catch(() => {});
  }, 10 * 60 * 1000); // every 10 minutes
});