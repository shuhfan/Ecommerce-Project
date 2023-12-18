// orderModel.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    address: {
        street: String,
        city: String,
        state: String,
        postalCode: String,
    },
    paymentMethod: String,
    products: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true },
            quantity: { type: Number, required: true },
        },
    ],
    amount: { type: Number, required: true },
    status: { type: String, default: 'Pending' },
    createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model('orders', orderSchema);

module.exports = Order;
