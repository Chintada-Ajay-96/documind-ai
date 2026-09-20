// app.ts
// Layer: assembly. Builds the Express app and plugs the pieces in order.

import cors from "cors";
import express from "express";

import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import routes from "./routes/index";

export function createApp() {
  const app = express();

  app.use(cors());          // lets our React page (on another port) call this server
  app.use(express.json());  // lets the server read JSON sent in requests

  app.use("/api", routes);  // every route starts with /api

  app.use(notFoundHandler); // must come after the routes
  app.use(errorHandler);    // must be last

  return app;
}