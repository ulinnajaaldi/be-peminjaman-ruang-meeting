import { Router } from "express";
import jwtAuth from "../middleware/jwtAuth.js";
import {
  createSaprasPeminjaman,
  deleteSaprasPeminjaman,
  getAllSaprasPeminjaman,
  updateSaprasPeminjaman,
} from "../controllers/SaprasPeminjamanController.js";

export const SaprasPeminjamanRouter = Router();

SaprasPeminjamanRouter.get("/", getAllSaprasPeminjaman);
SaprasPeminjamanRouter.post("/", jwtAuth, createSaprasPeminjaman);
SaprasPeminjamanRouter.put("/:id", jwtAuth, updateSaprasPeminjaman);
SaprasPeminjamanRouter.patch("/:id", jwtAuth, updateSaprasPeminjaman);
SaprasPeminjamanRouter.delete("/:id", jwtAuth, deleteSaprasPeminjaman);
