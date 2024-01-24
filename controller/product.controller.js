import Product from '../model/product.model.js';

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      company,
      description,
      attributes,
      inventory,
      thumbnail,
      cost,
      minOrderQuantity,
    } = req.body;

    const newProduct = new Product({
      name,
      company,
      description,
      attributes,
      inventory,
      thumbnail,
      cost,
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
