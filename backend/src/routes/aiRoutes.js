import { Router } from "express";
import { handleChat, getChatHistory } from "../controllers/aiController.js";

const router = Router();

router.post("/chat", handleChat);
router.get("/history", getChatHistory);

export default router;
