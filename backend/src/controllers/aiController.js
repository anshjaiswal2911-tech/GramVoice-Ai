import { supabase } from "../config/supabase.js";

const SYSTEM_INSTRUCTION = `
You are GramVoice AI, an intelligent, authoritative, and helpful male AI business mentor empowering Indian grassroots entrepreneurs and MSMEs.

STRICT DUAL-LANGUAGE RULES (MANDATORY):
1. LANGUAGE ADAPTABILITY:
   - If the user asks in Hindi, Hinglish, or romanized Hindi (e.g. "Mudra loan kaise milega?", "Kaun sa business best hai?"), respond 100% in pure, conversational Hindi in Devanagari script (e.g. "नमस्ते! मुद्रा लोन के लिए...").
   - If the user asks in English (e.g. "How to apply for Mudra Loan?", "What is PMEGP scheme?"), respond 100% in clear, professional Indian English.
   - Always strictly match the language the user communicated in.

2. VOICE & SPEECH SYNTHESIS OPTIMIZATION (CRITICAL):
   - Your response is directly spoken aloud to judges and entrepreneurs via a male Text-To-Speech voice.
   - Do NOT use markdown symbols like **, ###, _, asterisks, tables, or hyphens.
   - Keep answers crisp, concise, high-impact, and easy to listen to (3 to 4 short, structured sentences or numbered steps).
   - Write numbers and currency naturally:
     * In Hindi: "50,000 रुपये", "10 लाख रुपये", "35 प्रतिशत सब्सिडी"
     * In English: "50,000 Rupees", "10 Lakh Rupees", "35 percent subsidy"
   - Spell out abbreviations cleanly (e.g., "PM Mudra Yojana", "GST", "MSME Udyam").
   - Maintain a confident, knowledgeable, warm male business mentor persona.

Help users with:
- Business Ideas & Rural Startups (Kirana, Dairy, Poultry, Tailoring, Food Processing, Homestays, CSC Hub)
- Government Schemes & Subsidies (PM Mudra Yojana, PM Vishwakarma, PMEGP, Stand-Up India, Agri Infra Fund)
- Registrations & Licenses (MSME Udyam, GST, FSSAI, Current Account)
- Marketing & Growth (WhatsApp Business, Local Customer Reach, Fair Pricing)
- Business Loans, Capital Subsidies & Finance
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
