const Cart = require('../models/cartModel');
const Product = require('../models/ProductModel');
const Order = require('../models/orderModel')
const User = require('../models/UserModel')
const Category = require('../models/categoryModel')
const Razorpay = require('razorpay');
const razorpay = new Razorpay({
    key_id: process.env.RZP_KEY,
    key_secret: process.env.RZP_SECRET,
});
const getCart = async (userId) => {
    try {
        const cart = await Cart.findOne({ user: userId }).populate('items.product');
        return cart;
    } catch (error) {
        console.error('Error getting cart:', error);
        throw new Error('Error getting cart');
    }
};

const addToCart = async (userId, productId, productName, price, productImage, quantity) => {
    try {
        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
        }

        const existingItem = cart.items.find((item) => item.product.toString() === productId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({
                product: productId,
                productName,
                price,
                productImage,
                quantity,
            });
        }

        await cart.save();

        return cart;
    } catch (error) {
        console.error('Error adding to cart:', error);
        throw new Error('Error adding to cart');
    }
};

const removeFromCart = async (userId, productId) => {
    try {
        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            throw new Error('Cart not found');
        }

        cart.items = cart.items.filter(item => item.product.toString() !== productId);

        await cart.save();

        return cart;
    } catch (error) {
        console.error('Error removing item from cart:', error);
        throw new Error('Error removing item from cart');
    }
};

const updateQuantity = async (userId, productId, newQuantity) => {
    try {
      const cart = await Cart.findOne({ user: userId });
  
      if (cart) {
        const item = cart.items.find((item) => item.product.toString() === productId);
  
        if (item) {
          item.quantity = parseInt(newQuantity);
          await cart.save();
        }
      }
    } catch (error) {
      console.error('Error updating quantity in cart:', error);
      throw new Error('Error updating quantity in cart');
    }
  };

const paymentPage = async (req, res) => {
    try {
        const user = await User.findById(req.session.user_id);
        const cart = await Cart.findOne({ user: user });
        if (cart.items && cart.items.length !== 0) {
            const categories = await Category.find();
            const addresses = user.addresses;
            res.render('paymentPage', { user, categories, addresses });
        } else {
            return res.send('<script>alert("Your cart is empty. Please add items to proceed.");</script>');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};

const placeOrder = async (req, res) => {
    try {
        const { selectedAddress, paymentMethod } = req.body;
        const userId = req.session.user_id;
        const userCart = await Cart.findOne({ user: userId }).populate('items.product');
        if (!userCart) {
            return res.status(400).send('User cart not found');
        }
        const totalAmount = userCart.items.reduce((total, item) => {
            return total + item.product.price * item.quantity;
        }, 0);
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).send('User not found');
        }
        const selectedAddressDetails = user.addresses.find((address) => address.id === selectedAddress);
        if (!selectedAddressDetails) {
            return res.status(400).send('Selected address not found');
        }

        
        if (paymentMethod === 'Razorpay') {
            const orderData = {
                amount: totalAmount * 100, // Amount in paise
                currency: 'INR', 
                receipt: 'order_receipt',
                payment_capture: 1,
            };

            const razorpayOrder = await razorpay.orders.create(orderData);

            // Store the Razorpay order ID in your database or session
            req.session.razorpayOrderId = razorpayOrder.id;

            // Redirect the user to the Razorpay payment page
            res.render('razorpay_payment_page', { razorpayOrder,user });
        }
        const order = new Order({
            user: userId,
            address: selectedAddressDetails,
            paymentMethod: paymentMethod,
            products: userCart.items.map((item) => ({
                product: item.product._id,
                quantity: item.quantity,
            })),
            amount: totalAmount,
        });
        await order.save();
        await userCart.updateOne({ $set: { items: [] } });
        res.redirect('/'); 

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

  

module.exports = {
    getCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    paymentPage,
    placeOrder
};
