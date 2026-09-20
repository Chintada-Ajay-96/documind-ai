// routes/index.ts
// Collects all route files in one place.

import { Router } from "express";

import askRoutes from "./ask.routes";
import documentRoutes from "./document.routes";
import healthRoutes from "./health.routes";

const router = Router();

router.use("/health", healthRoutes);
router.use("/documents", documentRoutes);
router.use("/ask", askRoutes);

export default router;