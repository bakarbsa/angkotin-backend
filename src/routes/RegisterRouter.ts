import express from 'express';
import { addAdmin, addDriver, addPassenger } from '../controllers/UserController';

const registerRouter = express.Router();

registerRouter.post('/passengers', addPassenger);
registerRouter.post('/drivers', addDriver);
registerRouter.post('/admins', addAdmin);

export default registerRouter;