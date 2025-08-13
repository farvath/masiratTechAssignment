const mongoose = require('mongoose');

const inventoryHistorySchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true },
  oldQuantity: Number,
  newQuantity: Number,
  date: { type: Date, default: Date.now },
  updatedBy: String
});

module.exports = mongoose.model('Inventory_History', inventoryHistorySchema);
