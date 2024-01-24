import express from 'express';
import cors from 'cors';

import userRouter from './routes/user.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// Routing
app.use('/api/v1/auth', userRouter);

export default app;
