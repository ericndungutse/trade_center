import Order from '../model/order.model.js';

export const getOrders = async (req, res, next) => {
  try {
    const filter = {};
    if (req.user.role === 'user') filter.customer = req.user._id;
    if (req.user.role === 'admin') filter.company = req.user.company;

    const orders = await Order.find(filter);

    res.status(200).json({
      status: 'success',
      results: orders.length,
      data: {
        orders,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 'fail',
      message: 'An error occured',
    });
  }
};
