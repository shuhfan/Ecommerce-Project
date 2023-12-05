const Cart = require('../models/cartModel');
const Product = require('../models/ProductModel');
const Order = require('../models/orderModel')
const User = require('../models/UserModel')
const Category = require('../models/categoryModel')
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

const paymentPage = async(req,res)=>{
    try{
        const user = await User.findById(req.session.user_id)
        if(user.address.street && user.address.city && user.address.postalCode ){
            const categories = await Category.find()
            res.render('paymentPage',{user,categories})
        }else{
            
            return
        }
    }catch(error){
        console.log(error)
    }
}
  

module.exports = {
    getCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    paymentPage,
};
