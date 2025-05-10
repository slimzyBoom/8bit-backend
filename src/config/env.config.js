// config/index.js
import { configDotenv } from 'dotenv';
configDotenv();

export const JWT_SECRET = process.env.JWT_SECRET;
export const MONGO_URI = process.env.MONGO_URI 
export const PORT = process.env.PORT;
export const TRIVIA_API = process.env.TRIVIA_API;
export const NODE_ENV = process.env.NODE_ENV;

