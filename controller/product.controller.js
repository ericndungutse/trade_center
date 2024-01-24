import Product from '../model/product.model.js';

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      attributes,
      inventory,
      thumbnail,
      producerPrice,
      minOrderQuantity,
    } = req.body;

    const newProduct = new Product({
      name,
      company: req.user.company,
      description,
      attributes,
      inventory,
      thumbnail,
      producerPrice,
      minOrderQuantity,
    });

    const savedProduct = await newProduct.save();

    res.status(201).json({
      status: 'success',
      data: {
        product: savedProduct,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating product' });
  }
};
