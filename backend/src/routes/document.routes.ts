// document.routes.ts
// Layer: routes (the reception desk).

import { Router } from "express";

import { uploadDocument } from "../controllers/document.controller";
import { uploadPdf } from "../middleware/upload";

const router = Router();

// POST /api/documents  ->  check the upload  ->  controller
router.post("/", uploadPdf.single("file"), uploadDocument);

export default router;