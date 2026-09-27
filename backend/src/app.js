import express from "express";
import dotenv from "dotenv";
import { corsMiddleware } from "./middleware/cors.js";
import healthRoutes from "./routes/healthRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import mentorRoutes from "./routes/mentorRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";

dotenv.config();

const app = express();

// Global Middlewares
app.use(corsMiddleware());
app.use(express.json());

// API Routes
app.use("/api", healthRoutes);
app.use("/api", aiRoutes);
app.use("/api", mentorRoutes);
app.use("/api", statsRoutes);

// Root Welcome Endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    name: "GramVoice AI REST API",
    version: "1.0.0",
    description: "Multilingual Voice AI Copilot for Indian Rural Grassroots Entrepreneurs",
    endpoints: {
      health: "/api/health",
      chat: "POST /api/chat",
      history: "GET /api/history",
      bookings: ["GET /api/bookings", "POST /api/bookings"],
      stats: "GET /api/stats",
    },
  });
});

export default app;
