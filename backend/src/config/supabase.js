import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "https://zjgrhlzpiqlldgqozrsz.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_Y2xTdEIQ8R_47ivzTAJktg_wrBhtHbN";

export const supabase = (supabaseUrl && supabaseKey)
  ? createClient(supabaseUrl, supabaseKey)
  : null;

if (supabase) {
  console.log("📦 Supabase PostgreSQL: Connected successfully");
} else {
  console.log("⚠️ Supabase credentials missing. Running in local fallback mode.");
}
