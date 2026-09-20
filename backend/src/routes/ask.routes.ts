// ask.routes.ts
// Layer: routes (the reception desk).

import { Router } from "express";

import { ask } from "../controllers/ask.controller";

const router = Router();

// POST /api/ask
router.post("/", ask);

export default router;