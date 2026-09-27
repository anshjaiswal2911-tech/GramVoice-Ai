import { Router } from "express";
import { supabase } from "../config/supabase.js";

const router = Router();

router.get("/health", (req, res) => {
  const keyConfigured = Boolean((process.env.GEMINI_API_KEY || "").trim());
  res.json({
    success: true,
    status: "healthy",
    service: "GramVoice AI Backend",
    timestamp: new Date().toISOString(),
    apiKeyConfigured: keyConfigured,
    databaseConnected: Boolean(supabase),
  });
});

export default router;
