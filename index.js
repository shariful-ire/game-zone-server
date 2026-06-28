import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { toNodeHandler } from "better-auth/node";

import { connectDB } from "./lib/db.js";
import { getAuth } from "./lib/auth.js";
import errorHandler from "./middleware/errorHandler.js";
import facilityRoutes from "./routes/facilities.js";
import bookingRoutes from "./routes/bookings.js";

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

// Security
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { message: "Too many requests, please try again later" },
});
app.use(limiter);

// Logging
app.use(morgan("dev"));

// CORS
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Better Auth handler — must come BEFORE express.json() for its own routes
app.all("/api/auth/*splat", (req, res) => {
  const auth = getAuth();
  return toNodeHandler(auth)(req, res);
});

// Body parsing
app.use(express.json());
app.use(cookieParser());

// Health check
app.get("/", (req, res) => {
  res.json({
    name: "GameZone API",
    status: "running",
    version: "1.0.0",
  });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API routes
app.use("/api/facilities", facilityRoutes);
app.use("/api/bookings", bookingRoutes);

// Error handler
app.use(errorHandler);

// Start server
async function start() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`GameZone API running on http://localhost:${PORT}`);
      console.log(`Client URL: ${CLIENT_URL}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
}

start();
