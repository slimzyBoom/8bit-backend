import express from "express";
const app = express();

import connectDB from "./config/database.config.js";
import cors from "cors";
import corsOptions from "./config/cors.config.js";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import trivialRoute from "./routes/trivial.route.js";

import verifyAuth from "./middleware/verify_auth.js";
import errorHandler from "./middleware/errorLogger.js";

// 1. Connect to DB
connectDB();

// 2. Global middleware
app.use(cors(corsOptions)); // Must come first
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Comes before routes
app.use(morgan(process.env.NODE_ENV === "development" ? "dev" : "combined"));

// 3. Routes
app.use("/api/v1/auth", authRoute); // Auth route is public
app.use(verifyAuth); // Everything below requires authentication
app.use("/api/v1/user", userRoute);
app.use("/api/v1/trivia", trivialRoute);

// 4. Global error handler
app.use(errorHandler);

export default app;
