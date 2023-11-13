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
const userController = require('../controller/userController')

adminRouter.get('/', auth.isLogout, adminController.loadLogin);
adminRouter.post('/', adminController.varifyLogin);
adminRouter.get('/dashboard',  adminController.loadDashboard);
adminRouter.get('/logout', auth.isLogin, adminController.logout);
adminRouter.get('/users',adminController.loadUsers)
adminRouter.get('/changestatus',adminController.changeStatus)
adminRouter.post('/block',adminController.blockUser)
adminRouter.post('/unblock',adminController.unblockUser)




adminRouter.get('/categories',  categoryController.loadCategory);
adminRouter.post('/add-category',categoryController.addCategory)
adminRouter.get('/unlist',categoryController.unlistCategory)
adminRouter.get('/confirm-delete-category',categoryController.confirmDeleteCategory)
adminRouter.post('/delete-category',categoryController.deleteCategory)



adminRouter.get('/products', productController.loadProducts);
adminRouter.get('/add-product',productController.addProduct)
adminRouter.post('/add-product',productController.saveProduct)
adminRouter.get('/edit-product',productController.editProduct)
adminRouter.post('/edit-product',productController.updateProduct)
adminRouter.get('/delete-product',productController.deleteProduct)
adminRouter.post('/confirm-delete-product',productController.confirmDeleteProduct)


module.exports = adminRouter;
