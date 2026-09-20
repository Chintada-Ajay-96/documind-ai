// errorHandler.ts
// Layer: middleware (the safety net).
// Catches unknown addresses and any error thrown anywhere in the app,
// and turns them into a clean JSON reply instead of a crash.

import type { NextFunction, Request, Response } from "express";
import multer from "multer";

// Use this to throw errors that the user should see, e.g. new HttpError(400, "Please upload a PDF")
export class HttpError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({ error: "Route not found" });
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  let statusCode = 500;
  let message = "Something went wrong on the server.";

  if (err instanceof HttpError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof multer.MulterError) {
    statusCode = 400;
    message =
      err.code === "LIMIT_FILE_SIZE"
        ? "That file is too large (maximum 50 MB)."
        : `Upload problem: ${err.message}`;
  }

  if (statusCode === 500) {
    console.error(err); // log the real problem for us, but don't show it to users
  }

  res.status(statusCode).json({ error: message });
}