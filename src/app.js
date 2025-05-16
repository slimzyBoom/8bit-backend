import { NODE_ENV } from "./config/env.config.js";
import express from "express";
const app = express();
import verifyAuth from "./middleware/verify_auth.js";
import userRoute from "./routes/user.route.js";
import connectDB from "./config/database.config.js";
import cookie_parser from "cookie-parser";
import cors from "cors";
import corsOptions from "./config/cors.config.js";
import authRoute from "./routes/auth.route.js";
import trivial_route from "./routes/trivial.route.js";
import morgan from "morgan";
import errorHandler from "./middleware/errorLogger.js";
import achievementRoute from "./routes/achievementRoutes.js";

connectDB();

app.use(cors(corsOptions)); // Enable CORS for all routes
app.use(express.json());
app.use(cookie_parser());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev" ? NODE_ENV === "development" : "combined")); // Use morgan for logging requests in development mode


app.use("/api/v1/auth", authRoute);
app.use(verifyAuth); // Apply verifyAuth middleware to all routes after auth routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/trivia", trivial_route);
app.use('/api/v1/achievements', achievementRoute);
app.use(errorHandler);

export default app;


