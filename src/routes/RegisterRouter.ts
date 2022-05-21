import express from 'express';
import { addDriver, addPassenger } from '../controllers/UserController';

const registerRouter = express.Router();

registerRouter.post('/passenger', addPassenger);
registerRouter.post('/driver', addDriver);

export default registerRouter;