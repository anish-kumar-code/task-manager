import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"
import dotenv from "dotenv";
dotenv.config({ path: "config.env" });

// --- Routes import ---
import userRouter from './routes/user.routes.js'
import taskRouter from './routes/task.routes.js'

// --- Error handling middleware ---
import { errorHandler } from "./middlewares/error.middleware.js";
import morgan from "morgan";

const app = express();
app.use(morgan("dev"));

// CORS settings
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);

// Middleware to parse JSON
// Middleware to parse URL-encoded data
// Middleware to serve static files (e.g., images, PDFs)
// Middleware to handle cookies
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());


// Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/tasks", taskRouter);


// Simple route for testing
app.get("/test", (req, res) => {
    res.send("API is running!");
});


// --- CUSTOM ERROR HANDLER MIDDLEWARE ---
app.use(errorHandler);

export { app };
