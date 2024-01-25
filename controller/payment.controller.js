// import got from 'got';
import axios from 'axios';
import mongoose from 'mongoose';
import Order from '../model/order.model.js';

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
  const redirect_url =
    process.env.NODE_ENV === 'development'
      ? 'https://webhook.site/7bbde6f8-30f5-4d1a-83ec-f993b10c3887'
      : 'https://webhook.site/7bbde6f8-30f5-4d1a-83ec-f993b10c3887';

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
