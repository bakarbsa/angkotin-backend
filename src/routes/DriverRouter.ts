import express from 'express';
import { 
  getAllPassenger,
  getPassengerById, 
  getAllDriver, 
  getDriverById, 
  removeDriver, 
  updateDriver 
} from '../controllers/UserController';

const driverRouter = express.Router();

driverRouter.get('/', getAllDriver);
driverRouter.get('/:id', getDriverById);
driverRouter.delete('/:id', removeDriver);
driverRouter.put('/:id', updateDriver);

driverRouter.get('/passengers', getAllPassenger);
driverRouter.get('/passengers/:id', getPassengerById);

export default driverRouter;