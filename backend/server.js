import app from "./src/app.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("");
  console.log("==========================================");
  console.log("🚀 GramVoice AI Backend Server Running");
  console.log(`🌐 Local Server: http://localhost:${PORT}`);
  console.log(`🩺 Health Check: http://localhost:${PORT}/api/health`);
  console.log("==========================================");
  console.log("");

  // Keep-alive heartbeat for Render deployment
  const renderUrl = process.env.RENDER_EXTERNAL_URL || "https://gramvoice-ai.onrender.com";
  setInterval(() => {
    fetch(`${renderUrl}/api/health`).catch(() => {});
  }, 10 * 60 * 1000);
});
