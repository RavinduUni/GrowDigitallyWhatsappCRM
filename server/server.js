import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import n8nRouter from "./routes/n8nRoutes.js";
dotenv.config();

const app = express();


app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.send("Server is running...");
});

app.use("/api/n8n", n8nRouter);

// ✅ Export for Vercel — Vercel manages the HTTP server, NOT app.listen()
export default app;
