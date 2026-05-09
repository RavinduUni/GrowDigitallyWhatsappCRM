import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import n8nRouter from "./routes/n8nRoutes.js";
dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;

// Connect to database
await connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send('Server is running...')
});

app.use("/api/n8n", n8nRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});



