import express from 'express';
import { getPrediction } from '../controllers/PredictionController';

const predictionRouter = express.Router();

predictionRouter.use('/', getPrediction);

export default predictionRouter;