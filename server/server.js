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

function getAIClient() {
  const apiKey = (process.env.GEMINI_API_KEY || "").trim().replace(/^["']|["']$/g, "");
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not configured on the server.");
  }
  return new GoogleGenAI({ apiKey });
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

    const ai = getAIClient();
    console.log("User:", message);

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: message,
      config: {
        systemInstruction: `
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

Keep answers simple, friendly and practical.

Give step-by-step guidance whenever possible.

Do not invent government rules, eligibility,
fees or official information.
        `,
      },
    });

    const reply = response.text;

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
});