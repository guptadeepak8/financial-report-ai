import "dotenv/config";

import express, { type Express } from "express";
import cors from "cors";

import routes from "./routes";
import { errorMiddleware } from "./middleware/error.middleware";
import { env } from "./config/env";

const app: Express = express();

app.use(
  cors({
    origin: env.CLINET_URL,
  }),
);

app.use(express.json());
app.use("/api/v1", routes);
app.use(errorMiddleware);

app.listen(env.PORT,"0.0.0.0", () => {
  console.log(
    `Server running on http://localhost:${env.PORT}`,
  );
});