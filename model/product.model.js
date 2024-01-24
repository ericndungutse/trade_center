const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
  },

  attributes: {
    sizes: [String],
  },

  inventory: {
    type: Number,
    default: 0,
  },

  thumbnail: String,

  cost: Number,

  minOrderQuantity: Number,
});

const Product = mongoose.model('Product', productSchema);

export default Product;
