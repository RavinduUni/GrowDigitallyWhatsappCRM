import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import n8nRouter from "./routes/n8nRoutes.js";
dotenv.config();

const app = express();

// Lazy DB connection — runs once per container lifecycle (Vercel-compatible)
let isConnected = false;
const ensureDB = async () => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
};

app.use(cors());
app.use(express.json());

// Connect DB before every request (no-op after first connection)
app.use(async (req, res, next) => {
  try {
    await ensureDB();
    next();
  } catch (err) {
    res.status(500).json({ success: false, error: "Database connection failed" });
  }
});

app.get("/", (req, res) => {
  res.send("Server is running...");
});

app.use("/api/n8n", n8nRouter);

// ✅ Export for Vercel — Vercel manages the HTTP server, NOT app.listen()
export default app;
