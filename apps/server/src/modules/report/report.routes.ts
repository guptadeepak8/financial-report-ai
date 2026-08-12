import { Router } from "express";
import multer from "multer";

import { createReport, getReport } from "./report.controller";

import { reportEvents } from "./report.events";

const router:Router = Router();

const upload = multer({
  dest: "uploads/",

  limits: {
    fileSize: 20 * 1024 * 1024,
  },
});

router.post("/", upload.single("file"), createReport);

router.get("/:id/events", reportEvents);

router.get("/:id", getReport);

export default router;
