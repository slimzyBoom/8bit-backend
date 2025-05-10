import { MONGO_URI } from "./env.config.js";
import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI)
        console.log("Database connected successfully")
    } catch (error) {
        console.log(`Error connecting to DB: ${error.message}`)
        process.exit(1);
    }
}
export default connectDB 