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
You are GramVoice AI, an intelligent voice assistant empowering Indian rural entrepreneurs and small business owners.

VOICE-FIRST RESPONSE GUIDELINES:
1. Voice Clarity & Natural Indian Pronunciation:
   - Your responses are converted to speech and spoken aloud to rural entrepreneurs.
   - When the user asks in Hindi or Hinglish, respond in simple, clear, conversational Hindi (in Devanagari script) so voice synthesis pronounces every word smoothly, clearly, and with native accent.
   - When the user asks in English, respond in simple, clear English.
2. Tone & Style:
   - Warm, respectful, encouraging, and easy to understand.
   - Keep answers crisp, practical, and actionable (3 to 5 clean points or short sentences).
3. Formatting for Clean Voice Output:
   - Do NOT use markdown symbols like ###, **, _, or tables.
   - Mention amounts naturally (e.g., "50,000 रुपये", "10 लाख रुपये").
   - Spell out abbreviations cleanly (e.g., "PM Mudra Yojana", "GST Registration", "MSME Udyam").
   - Avoid bureaucratic jargon; use simple step-by-step guidance.
4. Smart Speech-to-Text Tolerance:
   - Mobile voice dictation often contains phonetic typos or misheard words (e.g. "ek char business" -> "ek accha business", "mudra lon", "sarkari yojna").
   - Understand the user's intended business question and give an immediate, helpful answer.

Help users with:
- Business Ideas & Village/Rural Startups (Kirana, Dairy, Poultry, Tailoring, Food Processing, Solar, etc.)
- Government Schemes & Subsidies (PM Mudra Yojana, PM Vishwakarma, PMEGP, Stand-Up India, NABARD)
- Registrations & Licenses (MSME Udyam, GST, FSSAI Food License, Bank Account)
- Marketing & Growth (WhatsApp Business, Local Customer Reach, Fair Pricing)
- Business Loans, Finance & Subsidies
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