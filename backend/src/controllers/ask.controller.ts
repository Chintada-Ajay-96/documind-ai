// ask.controller.ts
// Layer: controller (the waiter). Checks the request, calls the service, sends the reply.

import type { NextFunction, Request, Response } from "express";

import { env } from "../config/env";
import { HttpError } from "../middleware/errorHandler";
import { askQuestion } from "../services/ask.service";

export async function ask(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const question = typeof req.body?.question === "string" ? req.body.question.trim() : "";

    if (question.length < 3) {
      throw new HttpError(400, 'Please send JSON like {"question": "What is a page fault?"}.');
    }

    if (question.length > env.maxQuestionLength) {
      throw new HttpError(400, `The question is too long (maximum ${env.maxQuestionLength} characters).`);
    }

    res.json(await askQuestion(question));
  } catch (error) {
    next(error);
  }
}