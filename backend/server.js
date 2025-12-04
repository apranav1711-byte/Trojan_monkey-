import express from "express";
import cors from "cors";
import morgan from "morgan";
import logsRoutes from "./routes/logs.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(morgan("dev"));
app.use("/api/logs", logsRoutes);
app.get("/", (_req, res) => res.send("HTTP Traffic Attack Analyzer API running"));
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));