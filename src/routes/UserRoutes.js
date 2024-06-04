import { Router } from "express";
import jwtAuth from "../middleware/jwtAuth.js";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  getUserByIdWithPassword,
  updateUser,
} from "../controllers/UserController.js";

export const UserRouter = Router();

UserRouter.get("/", jwtAuth, getAllUsers);
UserRouter.get("/:id", jwtAuth, getUserById);
UserRouter.get("/:id/password", jwtAuth, getUserByIdWithPassword);
UserRouter.post("/", jwtAuth, createUser);
UserRouter.put("/:id", jwtAuth, updateUser);
UserRouter.patch("/:id", jwtAuth, updateUser);
UserRouter.delete("/:id", jwtAuth, deleteUser);
