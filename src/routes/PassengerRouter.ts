import express from 'express';
import { 
  getAllDriver, 
  getAllPassenger, 
  getPassengerById, 
  removePassenger, 
  updatePassenger, 
  getDriverById
} from '../controllers/UserController';

const passengerRouter = express.Router();

passengerRouter.get('/', getAllPassenger);
passengerRouter.get('/:id', getPassengerById);
passengerRouter.delete('/:id', removePassenger);
passengerRouter.put('/:id', updatePassenger);

passengerRouter.get('/drivers', getAllDriver);
passengerRouter.get('/drivers/:id', getDriverById);

export default passengerRouter;