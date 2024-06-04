import { Router } from "express";
import jwtAuth from "../middleware/jwtAuth.js";
import {
  createDetailPeminjamanRuangan,
  deleteDetailPeminjamanRuangan,
  getAllDetailPeminjamanRuangan,
  updateDetailPeminjamanRuangan,
  getDetailPeminjamanRuangan,
} from "../controllers/DetailPeminjamRuanganController.js";

export const DetailPeminjamRuanganRouter = Router();

DetailPeminjamRuanganRouter.get("/", getAllDetailPeminjamanRuangan);
DetailPeminjamRuanganRouter.get("/:id", getDetailPeminjamanRuangan);
DetailPeminjamRuanganRouter.post("/", jwtAuth, createDetailPeminjamanRuangan);
DetailPeminjamRuanganRouter.put("/:id", jwtAuth, updateDetailPeminjamanRuangan);
DetailPeminjamRuanganRouter.patch(
  "/:id",
  jwtAuth,
  updateDetailPeminjamanRuangan
);
DetailPeminjamRuanganRouter.delete(
  "/:id",
  jwtAuth,
  deleteDetailPeminjamanRuangan
);
