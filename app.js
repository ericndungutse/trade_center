import express from 'express';

import userRouter from './routes/user.routes.js';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// Routing
app.use('/api/v1/auth', userRouter);

export default app;
