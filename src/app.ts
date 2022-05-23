import express, { Express, json } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { AuthController } from './controllers/AuthController';
import { Authentication, IsAdmin, IsDriver, IsPassenger } from './middleware';
import passengerRouter from './routes/PassengerRouter';
import driverRouter from './routes/DriverRouter';
import adminRouter from './routes/AdminRouter';
import registerRouter from './routes/RegisterRouter';

dotenv.config();

const app: Express = express();

app.use(cors());
app.use(json());

app.post('/auth', AuthController);

app.use('/register', registerRouter);

app.use('/passengers', Authentication, IsPassenger, passengerRouter);
app.use('/drivers', Authentication, IsDriver, driverRouter);
app.use('/admins', Authentication, IsAdmin, adminRouter);

export default app;