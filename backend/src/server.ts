import express from "express"
import cors from "cors"
import healthRouter from "./routes/health.routes.js";
import ordersRouter from "./routes/orders.routes.js"

const app = express();

const PORT = 5000;

app.use(cors({
    origin: "http://localhost:5173"
}));

app.use(express.json());

app.use("/health", healthRouter);
app.use("/orders", ordersRouter);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
