import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
  },

  description: {
    type: String,
    required: true,
  },

  attributes: {
    sizes: [String],
  },

  inventory: {
    type: Number,
    default: 0,
  },

  thumbnail: String,

  producerPrice: {
    type: Number,
  },

  minOrderQuantity: Number,
});

const Product = mongoose.model('Product', productSchema);
export default Product;
