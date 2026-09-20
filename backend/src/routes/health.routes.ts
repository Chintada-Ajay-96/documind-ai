// health.routes.ts
// Layer: routes (the reception desk).
// Says: "a GET request to this address goes to this controller function".

import { Router } from "express";

import { getHealth } from "../controllers/health.controller";

const router = Router();

router.get("/", getHealth);

export default router;