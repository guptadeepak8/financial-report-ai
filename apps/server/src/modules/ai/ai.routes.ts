import { Router } from "express";

import { extractReportFromDocument } from "./ai.controller";

const router:Router = Router();

router.post("/extract", extractReportFromDocument);

export default router;