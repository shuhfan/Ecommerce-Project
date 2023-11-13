const express = require('express')
const user_router = express()
const session = require('express-session')
const config = require('../config/session')
user_router.use(session({
    secret : config.userSession,
    resave: false,
    saveUninitialized: true
}))

const auth = require('../middleware/authentication')
user_router.set('view engine','ejs')
user_router.set('views','./views/user')

const userController = require('../controller/userController')
const productController = require('../controller/productController')

user_router.get('/',auth.isLogout,userController.loadSignup)
user_router.post('/',userController.insertUser)
user_router.get('/send_otp',userController.sendOTP)
user_router.get('/login',auth.isLogout,userController.loadLogin)
user_router.post('/login',userController.varifyUser)
user_router.get('/signout',userController.signout)
user_router.get('/home',userController.loadHome)



user_router.get('/aProduct',productController.aProductPage)


module.exports = user_router