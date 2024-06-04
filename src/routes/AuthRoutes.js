import { Router } from "express";
import { login, register, getMe } from "../controllers/AuthController.js";
import jwtAuth from "../middleware/jwtAuth.js";

export const AuthRouter = Router();

AuthRouter.post("/login", login);
AuthRouter.post("/register", register);
AuthRouter.get("/me", jwtAuth, getMe);
