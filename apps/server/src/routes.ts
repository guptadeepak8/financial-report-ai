import { Router } from "express";
import documentRoutes from './modules/documents/document.routes'
import aiRoutes from './modules/ai/ai.routes'

const router:Router = Router()

router.get("/health", (_req, res) => {
  res.json({
    status: "ok",
  });
});

router.use("/documents",documentRoutes)
router.use("/ai", aiRoutes);
export default router