import express from 'express';
import { getAllDriver } from '../controllers/UserController';

const passengerRouter = express.Router();

passengerRouter.get('/', getAllDriver);

export default passengerRouter;