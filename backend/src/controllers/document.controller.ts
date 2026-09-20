// document.controller.ts
// Layer: controller (the waiter). Reads the request, calls the service, sends the reply.

import type { NextFunction, Request, Response } from "express";

import { HttpError } from "../middleware/errorHandler";
import { ingestDocument } from "../services/document.service";

export async function uploadDocument(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.file) {
      throw new HttpError(400, 'No file received. Send a PDF in the form field named "file".');
    }

    const summary = await ingestDocument(req.file);
    res.status(201).json(summary);
  } catch (error) {
    next(error); // hand any problem to the error handler
  }
}