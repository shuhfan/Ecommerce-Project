const express = require('express')
const user_router = express()
const session = require('express-session')
const config = require('../config/session')
user_router.use(session({
    secret : config.userSession,
    resave: false,
    saveUninitialized: true,
    cookie : {secure:false}
}))
const auth = require('../middleware/authentication')
user_router.set('view engine','ejs')
user_router.set('views','./views/user')

const userController = require('../controller/userController')
const productController = require('../controller/productController')
const cartController = require('../controller/cartController')


user_router.get('/',auth.isLogout,userController.loadSignup)
user_router.post('/',userController.insertUser)
user_router.get('/send_otp',userController.sendOTP)
user_router.get('/login',auth.isLogout,userController.loadLogin)
user_router.post('/login',userController.varifyUser)
user_router.get('/signout',auth.isLogin,userController.signout)
user_router.get('/home',auth.isLogin,userController.loadHome)


user_router.get('/profile',auth.isLogin,userController.loadProfile)
user_router.put('/profile',auth.isLogin, userController.updateUserProfile);
user_router.put('/password',auth.isLogin, userController.changePassword);
user_router.post('/addAddress',auth.isLogin,userController.addAddress)
user_router.post('/removeAddress',auth.isLogin,userController.removeAddress)
user_router.post('/cart/add',auth.isLogin,cartController.addToCart)


user_router.get('/aProduct',productController.aProductPage)

user_router.get('/check-login-status', (req, res) => {
    res.json({ loggedIn: !!req.session.user_id }); 
});
module.exports = user_router