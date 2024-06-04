import { Router } from "express";

export const HealthRouter = Router();

HealthRouter.get("/", (req, res, next) => {
  res.status(200).send({ status: "200", message: "Hidup Abangku 🔥" });
});
