import { Router } from "express";
import reportRoutes from "./modules/report/report.routes";

const router:Router = Router()

router.get("/health", (_req, res) => {
  res.json({
    status: "ok",
  });
});

router.use("/reports", reportRoutes );
export default router