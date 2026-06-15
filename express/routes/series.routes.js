import { Router } from "express";
import {
  getAllSeries,
  getSeriesById,
  createSeries,
  updateSeries,
  deleteSeries,
} from "../controllers/series.controller.js";

const router = Router();

router.get("/", getAllSeries);
router.get("/:id", getSeriesById);
router.post("/", createSeries);
router.put("/:id", updateSeries);
router.delete("/:id", deleteSeries);

export default router;
