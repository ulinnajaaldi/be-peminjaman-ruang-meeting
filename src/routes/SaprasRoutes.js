import { Router } from "express";
import jwtAuth from "../middleware/jwtAuth.js";
import {
  createSapras,
  deleteSapras,
  getAllSapras,
  getSapras,
  updateSapras,
} from "../controllers/SaprasController.js";

export const SaprasRouter = Router();

SaprasRouter.get("/", getAllSapras);
SaprasRouter.get("/:id", getSapras);
SaprasRouter.post("/", jwtAuth, createSapras);
SaprasRouter.put("/:id", jwtAuth, updateSapras);
SaprasRouter.patch("/:id", jwtAuth, updateSapras);
SaprasRouter.delete("/:id", jwtAuth, deleteSapras);
