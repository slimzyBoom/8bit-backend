import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from "./config/db.config"

const app = express();
app.use(connectDB); // Connect to the database

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

export default app;


