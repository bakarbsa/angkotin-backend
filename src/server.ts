import dotenv from 'dotenv';
import app from './app';
import userRouter from './routes/UserRouter';
import UserRouter from './routes/UserRouter'

dotenv.config();

const PORT = process.env.PORT || 3000;

app.use('/users', UserRouter);

app.listen(PORT, () => {
  console.log(`[server] Server is running at https://localhost:${PORT}`);
});