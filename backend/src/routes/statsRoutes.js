import { Router } from "express";
import { getDashboardStats } from "../controllers/statsController.js";

const router = Router();

router.get("/stats", getDashboardStats);

export default router;
