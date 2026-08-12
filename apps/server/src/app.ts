import express,{ type Express } from "express";
import routes from "./routes";
const app:Express = express();

app.use(express.json());
app.use("/api/v1", routes);

export default app;