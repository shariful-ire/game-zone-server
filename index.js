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

// CORS — must be BEFORE rate limiters so even 429 responses include CORS headers
const allowedOrigins = [CLIENT_URL, "http://localhost:3000", "http://localhost:3001"].filter(Boolean);
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);

// Rate limiting — general
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { message: "Too many requests, please try again later" },
});
app.use(generalLimiter);

// Auth rate limit — higher limit because useSession() polls on every page load
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: "Too many auth attempts, please try again later" },
});
app.use("/api/auth", authLimiter);

// Logging
app.use(morgan("dev"));

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

// Connect to DB on cold start
connectDB().catch((err) => {
  console.error("Failed to connect to DB:", err.message);
});

// Local dev: listen on PORT; Vercel: export the app
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`GameZone API running on http://localhost:${PORT}`);
    console.log(`Client URL: ${CLIENT_URL}`);
  });
}

export default app;
