import express from 'express';
import { getAllUsers } from '../controllers/UserController';

const userRouter = express.Router();

userRouter.get('/', getAllUsers);

export default userRouter;