const express = require('express');
const adminRouter = express();
const session = require('express-session');
const config = require('../config/session');
adminRouter.use(session({
    secret: config.adminSession,
    resave: false,
    saveUninitialized: true
}));

const auth = require('../middleware/adminAuthentication');
adminRouter.set('view engine', 'ejs'); 
adminRouter.set('views', './views/admin');


const adminController = require('../controller/adminController');
const categoryController = require('../controller/categoryController');
const productController = require('../controller/productController');
const orderController = require('../controller/orderController')

adminRouter.get('/', auth.isLogout, adminController.loadLogin);
adminRouter.post('/', adminController.varifyLogin);
adminRouter.get('/dashboard',auth.isLogin,  adminController.loadDashboard);
adminRouter.get('/logout', auth.isLogin, adminController.logout);
adminRouter.get('/users',auth.isLogin,adminController.loadUsers)
adminRouter.get('/changestatus',auth.isLogin,adminController.changeStatus)
adminRouter.post('/block',auth.isLogin,adminController.blockUser)
adminRouter.post('/unblock',auth.isLogin,adminController.unblockUser)




adminRouter.get('/categories',auth.isLogin,  categoryController.loadCategory);
adminRouter.post('/add-category',auth.isLogin,categoryController.addCategory)
adminRouter.get('/unlist',auth.isLogin,categoryController.unlistCategory)
adminRouter.get('/confirm-delete-category',auth.isLogin,categoryController.confirmDeleteCategory)
adminRouter.post('/delete-category',auth.isLogin,categoryController.deleteCategory)



adminRouter.get('/products',auth.isLogin, productController.loadProducts);
adminRouter.get('/add-product',auth.isLogin,productController.addProduct)
adminRouter.post('/add-product',auth.isLogin,productController.saveProduct)
adminRouter.get('/edit-product',auth.isLogin,productController.editProduct)
adminRouter.post('/edit-product',auth.isLogin,productController.updateProduct)
adminRouter.get('/delete-product',auth.isLogin,productController.deleteProduct)
adminRouter.post('/confirm-delete-product',auth.isLogin,productController.confirmDeleteProduct)


adminRouter.get('/orders',auth.isLogin,orderController.loadOrder)
adminRouter.get('/orders/change-status/:orderId',auth.isLogin, orderController.changeOrderStatus);

module.exports = adminRouter;
