import { Router } from "express";
import jwtAuth from "../middleware/jwtAuth.js";
import {
  createRuangan,
  deleteRuangan,
  getAllRuangan,
  updateRuangan,
  getRuanganDetail,
  getRuanganBySlug,
} from "../controllers/RuanganController.js";

export const RuanganRouter = Router();

RuanganRouter.get("/", getAllRuangan);
RuanganRouter.get("/:slug", getRuanganBySlug);
RuanganRouter.get("/:slug/detail", getRuanganDetail);
RuanganRouter.post("/", jwtAuth, createRuangan);
RuanganRouter.put("/:id", jwtAuth, updateRuangan);
RuanganRouter.patch("/:id", jwtAuth, updateRuangan);
RuanganRouter.delete("/:slug", jwtAuth, deleteRuangan);
