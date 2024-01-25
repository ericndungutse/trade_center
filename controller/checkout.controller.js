// import got from 'got';
import axios from 'axios';
import mongoose from 'mongoose';
import Order from '../model/order.model.js';
import Product from '../model/product.model.js';

async function flutterwaveChackout(
  customerId,
  amount,
  tx_ref,
  currency,
  redirect_url,
  name,
  email
) {
  const response = await axios.post(
    'https://api.flutterwave.com/v3/payments',
    {
      tx_ref,
      amount,
      currency,
      redirect_url,
      meta: {
        customerId,
      },
      customer: {
        email,
        name,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
      },
    }
  );

  const paymentData = response.data;

  return paymentData;
}

export const checkout = async (req, res, next) => {
  const customerId = req.user._id;
  const tx_ref = Date.now() + customerId;
  const order = { ...req.body, customer: customerId, tx_ref };
  const { amount, currency } = order;
  const { email, name } = req.user;

  // A frontend URL
  const redirect_url = 'https://trade-center.onrender.com/api/v1/callback';

  try {
    const session = await mongoose.startSession();
    let checkoutResponse;

    await session.withTransaction(async () => {
      // Create Order
      // TODO: Check Quantity Avalability OR Do Not Display Products
      await Order.create([order], { session });
      // Checkout to flutterwave
      checkoutResponse = await flutterwaveChackout(
        customerId,
        amount,
        tx_ref,
        currency,
        redirect_url,
        name,
        email
      );
    });

    await session.endSession();

    res.status(200).json(checkoutResponse);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Verify Transaction, Create order, and update product quantities
export const verifyTransaction = async (req, res) => {
  // Verify Transaction
  const respose = await verifyTrans(String(req.body.data.id));

  // Update Products Quantities
  if (respose.data.status !== 'successful') {
    // TODO: LOGER TO NOTIFY TRANSACTACTION FAILURE (CONSIDER KAFKA)
    res.status(401).end();
  }

  const order = await Order.findOne({
    tx_ref: respose.data.tx_ref,
  });

  order.status = 'pending';
  order.transId = respose.data.id;

  await order.save({
    validateBeforeSave: false,
  });

  // Update Order Products quantities
  const orderProducts = order.items;
  orderProducts.forEach(async ({ product, quantity }) => {
    const orderProduct = await Product.findById(product, ['stockQuantity']);
    orderProduct.stockQuantity -= quantity;
    await orderProduct.save();
  });

  res.status(200).end();
};

async function verifyTrans(transactionId) {
  const flw = new Flutterwave(
    process.env.FLW_PUBLIC_KEY,
    process.env.FLW_SECRET_KEY
  );

  const response = await flw.Transaction.verify({
    id: `${transactionId}`,
  });

  return response;
}
