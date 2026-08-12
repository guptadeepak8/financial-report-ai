import { Router } from "express";
import multer from "multer";
import { uploadDocument } from "./document.controller";



const router:Router = Router();

const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
});

router.post("/", upload.single("file"), uploadDocument);

export default router;