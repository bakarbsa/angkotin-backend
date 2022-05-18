import express, { Express, json } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app: Express = express();

app.use(cors());
app.use(json());

export default app;