// pythonProcessor.client.ts
// Layer: client (a supplier that talks to the outside world).
// Starts the Python program, waits for it to finish, and reads its JSON answer.
// It knows HOW to talk to Python. It knows nothing about uploads or web requests.

import { spawn } from "node:child_process";

import { env } from "../config/env";
import type { ProcessedPdf } from "../types/document.types";

// Thrown when Python ran but could not process the PDF (e.g. a scanned PDF)
export class PdfProcessingError extends Error {}

export function processPdfWithPython(pdfPath: string): Promise<ProcessedPdf> {
  return new Promise((resolve, reject) => {
    const child = spawn(env.pythonCommand, [env.processorScript, pdfPath]);

    const outputParts: Buffer[] = [];
    const errorParts: Buffer[] = [];

    child.stdout.on("data", (part: Buffer) => outputParts.push(part));
    child.stderr.on("data", (part: Buffer) => errorParts.push(part));

    // Python could not even be started (wrong command, not installed...)
    child.on("error", (error) => {
      reject(new Error(`Could not start Python using "${env.pythonCommand}": ${error.message}`));
    });

    child.on("close", (exitCode) => {
      if (exitCode !== 0) {
        const lines = Buffer.concat(errorParts).toString("utf-8").trim().split("\n");
        const lastLine = lines[lines.length - 1] || `Python stopped with code ${exitCode}`;
        reject(new PdfProcessingError(lastLine.replace(/^ERROR:\s*/, "")));
        return;
      }

      try {
        const text = Buffer.concat(outputParts).toString("utf-8");
        resolve(JSON.parse(text) as ProcessedPdf);
      } catch {
        reject(new Error("Python returned an answer that is not valid JSON."));
      }
    });
  });
}