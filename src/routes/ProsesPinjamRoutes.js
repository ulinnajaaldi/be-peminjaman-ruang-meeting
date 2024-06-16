import { Router } from "express";
import jwtAuth from "../middleware/jwtAuth.js";
import {
  createProsesPinjam,
  deleteProsesPinjam,
  getAllProsesPinjam,
  getProsesPinjamById,
  updateProsesPinjam,
  createPeminjamanRuangan,
  getPeminjamanBasedOnUser,
  acceptProsesPinjam,
  rejectProsesPinjam,
  checkProsesPinjam,
} from "../controllers/ProsesPinjamController.js";

export const ProsesPinjamRouter = Router();

ProsesPinjamRouter.get("/", jwtAuth, getAllProsesPinjam);
ProsesPinjamRouter.get("/:id", jwtAuth, getProsesPinjamById);
ProsesPinjamRouter.post("/", jwtAuth, createProsesPinjam);
ProsesPinjamRouter.put("/:id", jwtAuth, updateProsesPinjam);
ProsesPinjamRouter.patch("/:id", jwtAuth, updateProsesPinjam);
ProsesPinjamRouter.delete("/:id", jwtAuth, deleteProsesPinjam);
ProsesPinjamRouter.post("/peminjaman-ruangan", createPeminjamanRuangan);
ProsesPinjamRouter.get("/user/details", jwtAuth, getPeminjamanBasedOnUser);
ProsesPinjamRouter.patch("/accept/:id", jwtAuth, acceptProsesPinjam);
ProsesPinjamRouter.patch("/reject/:id", jwtAuth, rejectProsesPinjam);
ProsesPinjamRouter.post("/check-peminjaman", checkProsesPinjam);
