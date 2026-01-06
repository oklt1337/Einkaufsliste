import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import itemsRouter from './routes/items.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config({ path: new URL('../.env', import.meta.url) });

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  }),
);
app.use(express.json());

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.use(itemsRouter);

app.use(errorHandler);

export default app;
