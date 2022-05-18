import express, { Express, json } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import UserRouter from './routes/UserRouter'

dotenv.config();

const app: Express = express();

app.use(cors());
app.use(json());

app.use('/users', UserRouter);

export default app;