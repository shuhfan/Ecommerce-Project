const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true },
      quantity: { type: Number, required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model('orders', orderSchema);

module.exports = Order;