const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  unit: String,
  category: String,
  brand: String,
  stock: { type: Number, default: 0 },
  status: { type: String, enum: ['In_Stock', 'Out_Of_Stock'], default: 'In_Stock' },
  image: String
}, { timestamps: true });

module.exports = mongoose.model('products', productSchema);
