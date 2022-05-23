import express from 'express';
import { 
  addAdmin, 
  getAllAdmin, 
  getAllDriver, 
  getAllPassenger, 
  getDriverById, 
  getPassengerById,
  removeAdmin, 
  removeDriver, 
  removePassenger, 
  updateDriver, 
  updatePassenger 
} from '../controllers/UserController';

const adminRouter = express.Router();

adminRouter.get('/', getAllAdmin);
adminRouter.post('/', addAdmin);
adminRouter.delete('/:id', removeAdmin);

adminRouter.get('/drivers', getAllDriver);
adminRouter.get('/drivers/:id', getDriverById);
adminRouter.delete('/drivers/:id', removeDriver);
adminRouter.put('/drivers/:id', updateDriver);

adminRouter.get('/passengers', getAllPassenger);
adminRouter.get('/passengers/:id', getPassengerById);
adminRouter.delete('/passengers/:id', removePassenger);
adminRouter.put('/passengers/:id', updatePassenger);

export default adminRouter;