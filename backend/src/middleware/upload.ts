// upload.ts
// Layer: middleware. Receives the uploaded file BEFORE the controller runs.
// It rejects non-PDFs, rejects huge files, and saves good files to disk.

import { randomUUID } from "node:crypto";
import fs from "node:fs";

import multer from "multer";

import { env } from "../config/env";
import { HttpError } from "./errorHandler";

// Make sure the folder for uploads exists
fs.mkdirSync(env.uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, env.uploadDir),
  // Save every file as <random-id>.pdf so two files can never overwrite each other
  filename: (_req, _file, callback) => callback(null, `${randomUUID()}.pdf`),
});

export const uploadPdf = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
  fileFilter: (_req, file, callback) => {
    const looksLikePdf =
      file.mimetype === "application/pdf" && file.originalname.toLowerCase().endsWith(".pdf");

    if (looksLikePdf) {
      callback(null, true);
    } else {
      callback(new HttpError(400, "Only PDF files are allowed."));
    }
  },
});