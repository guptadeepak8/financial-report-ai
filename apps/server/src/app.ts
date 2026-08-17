import express, { type Express } from "express";
import cors from "cors";

import routes from "./routes";
import { errorMiddleware } from "./middleware/error.middleware";


const app: Express = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

app.use("/api/v1", routes);

app.use(errorMiddleware);

export default app;