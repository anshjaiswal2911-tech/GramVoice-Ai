import { supabase } from "../config/supabase.js";

const SYSTEM_INSTRUCTION = `
You are GramVoice AI, an intelligent voice assistant empowering Indian rural entrepreneurs and small business owners.

VOICE-FIRST RESPONSE GUIDELINES:
1. Voice Clarity & Natural Indian Pronunciation:
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
   - Mobile voice dictation often contains phonetic typos or misheard words.
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
          system_instruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
          contents: [{ role: "user", parts: [{ text: message }] }],
          generationConfig: { maxOutputTokens: 500, temperature: 0.7 },
        }),
      });

      const data = await res.json();
      if (res.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      }
      lastError = new Error(data.error?.message || `Model ${model} failed with status ${res.status}`);
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error("All AI models are currently busy. Please try again in a few seconds.");
}

export async function handleChat(req, res) {
  try {
    const { message, language = "hi-IN", sessionId = null } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, error: "Message is required" });
    }

    const apiKey = (process.env.GEMINI_API_KEY || "").trim().replace(/^[\"\']|[\"\']$/g, "");
    if (!apiKey) {
      return res.status(500).json({ success: false, error: "GEMINI_API_KEY is not configured on the server." });
    }

    console.log("[Chat Request] User:", message);
    const reply = await generateAIResponse(message, apiKey);
    console.log("[Chat Response] AI:", reply);

    if (supabase) {
      supabase
        .from("voice_chats")
        .insert([{ session_id: sessionId, user_message: message, ai_response: reply, language }])
        .then(({ error }) => {
          if (error) console.warn("Supabase voice_chats save warning:", error.message);
        })
        .catch(err => console.warn("Supabase voice_chats save error:", err));
    }

    res.json({ success: true, reply });
  } catch (error) {
    console.error("Chat Error:", error);
    res.status(500).json({ success: false, error: error.message || "AI request failed" });
  }
}

export async function getChatHistory(req, res) {
  try {
    if (!supabase) return res.json({ success: true, history: [] });

    const { data, error } = await supabase
      .from("voice_chats")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) throw error;
    res.json({ success: true, history: data || [] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}
