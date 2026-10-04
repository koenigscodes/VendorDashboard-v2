import express from "express"
import healthRouter from "./routes/health.routes.js";

const app = express();

const PORT = 5000;

app.use("/health", healthRouter);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
