// health.controller.ts
// Layer: controller (the waiter). Only deals with the web request and response.

import type { NextFunction, Request, Response } from "express";

import { getHealthReport } from "../services/health.service";

export async function getHealth(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    res.json(await getHealthReport());
  } catch (error) {
    next(error);
  }
}