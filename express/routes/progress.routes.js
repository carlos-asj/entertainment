import { Router } from "express";
import {
  getDashSeries,
  postProgress,
} from "../controllers/progress.controller.js";

const router = Router();

router.post("/", postProgress);
router.get("/dashboard", getDashSeries);

export default router;
