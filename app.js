import express from 'express';
import cors from 'cors';

import userRouter from './routes/user.routes.js';
import productRouter from './routes/product.routes.js';
import companyRouter from './routes/company.routes.js';
import checkoutRouter from './routes/checkout.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  console.log(req.originalUrl);
  res.send('Hello, world!');
});

// Routing
app.use('/api/v1/auth', userRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/companies', companyRouter);
app.use('/api/v1/checkout', checkoutRouter);

export default app;
