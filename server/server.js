import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5000;

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "GramVoice AI backend is running",
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

    console.log("User:", message);

    const response = await ai.models.generateContent({
    model: "gemini-3.5-flash-lite",
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