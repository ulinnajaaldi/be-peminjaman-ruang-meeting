import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { routes } from "./src/routes/index.js";

dotenv.config();

const app = express();
const port = 5000;

app.use(express.json());

const corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));

routes(app);

app.listen(port, () => {
  console.log(`server is listening in port http://localhost:${port}`);
});
