import type { Request, Response } from "express";



import { AppError } from "../../utils/app-error";
import { parseDocument } from "./document.service";

export async function uploadDocument(
  req: Request,
  res: Response,
): Promise<void> {
  if (!req.file) {
    throw new AppError(
      "No document was uploaded",
      400,
      "FILE_REQUIRED",
    );
  }

  const document = await parseDocument(
    req.file.path,
    req.file.originalname,
  );

  res.status(200).json({
    success: true,
    data: document,
  });
}