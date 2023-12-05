const express = require('express');
const router = express();
const cartController = require('../controller/cartController');
const Category = require('../models/categoryModel')
const User = require('../models/UserModel')
const auth = require('../middleware/authentication')
router.set('view engine', 'ejs')
router.set('views', './views/user')

router.get('/', auth.isLogin, async (req, res) => {
    try {
        const userId = req.session.user_id;
        const cart = await cartController.getCart(userId);
        const categories = await Category.find()
        const user = await User.findById(userId)
        let total = calculateCartSubtotal(cart.items)
        res.render('loadCart', { cart: cart, categories: categories,total,user });
    } catch (error) {
        console.error('Error getting cart:', error);
        res.status(500).json({ error: 'Error getting cart' });
    }
});
function calculateCartSubtotal(items) {
    const subtotal = items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    return subtotal;
}

router.post('/add', auth.isLogin, async (req, res) => {
    try {
        const userId = req.session.user_id;
        const { productId, productName, price, productImage, quantity } = req.body;
        const cart = await cartController.addToCart(userId, productId, productName, price, productImage, quantity);
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ error: 'Error adding to cart' });
    }
});

router.delete('/remove/:productId',auth.isLogin, async (req, res) => {
    try {
        const userId = req.session.user_id;
        const { productId } = req.params;
        const cart = await cartController.removeFromCart(userId, productId);
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error removing item from cart:', error);
        res.status(500).json({ error: 'Error removing item from cart' });
    }
});

router.put('/updateQuantity/:productId',auth.isLogin, async (req, res) => {
    try {
      const userId = req.session.user_id;
      const { productId } = req.params;
      const { newQuantity } = req.body;
  
      await cartController.updateQuantity(userId, productId, newQuantity);
  
      res.status(200).json({ message: 'Quantity updated successfully' });
    } catch (error) {
      console.error('Error updating quantity:', error);
      res.status(500).json({ error: 'Error updating quantity' });
    }
  });

router.get('/checkout',auth.isLogin,cartController.paymentPage)

module.exports = router;
