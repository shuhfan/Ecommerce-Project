const Product = require('../models/ProductModel')
const Category = require('../models/categoryModel')
const User = require('../models/UserModel')
const multer = require('multer');
const upload = require('../multer/multer')
const fs = require('fs');
const path = require('path')
const loadProducts = async (req, res) => {
    try {
        res.setHeader('cache-control', 'no-cache, no-store, must-revalidate');
        const sortBy = req.query.sort || '';
        let sortOptions = {};
        if (sortBy === 'id') {
            sortOptions = { _id: 1 };
        } else if (sortBy === 'name') {
            sortOptions = { productName: 1 };
        }
        const products = await Product.find().sort(sortOptions);
        res.render('products', { products, title: 'Admin Product Management' });
    } catch (error) {
        console.log(error.message);
    }
};

const addProduct = async (req, res) => {
    try {
        const categories = await Category.find()
        res.render('addProduct', { title: 'Add Product', categories, message: '' })
    } catch (error) {
        console.log(error.message)
    }
}

const saveProduct = async (req, res) => {
    try {
        const existingProduct = await Product.findOne({ productName: req.body.productTitle });
        if (existingProduct) {
            const categories = await Category.find();
            return res.status(200).render('addProduct', { title: 'Add Product', categories, message: 'Product with the same name already exists' });
        }
        upload.array('images', 12)(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ error: 'File upload error' });
            } else if (err) {
                return res.status(500).json({ error: 'Internal server error' });
            }
            const productImages = req.files.map(file => file.filename);
            const productData = {
                productName: req.body.productTitle,
                productDescription: req.body.productDescription,
                brandName: req.body.brandName,
                price: req.body.costInINR,
                category: req.body.category,
                productImage: productImages,
            };
            const product = new Product(productData);
            try {
                await product.save();
                const categories = await Category.find()
                return res.render('addProduct', { title: 'Add Product', categories, message: 'Product Added Successfully' });
            } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Database save error' });
            }
        });
    } catch (error) {
        console.error(error);
    }
};

const editProduct = async (req, res) => {
    try {
        const productID = req.query.id
        const product = await Product.findById(productID)
        const categories = await Category.find();
        if (product) {
            res.render('editProduct', { title: 'Edit Product', product, categories })
        } else {
            res.status(404).send('Product not found');
        }
    } catch (error) {
        console.log(error.message)
    }
}

const updateProduct = async (req, res) => {
    try {
        const productId = req.query.id;
        const product = await Product.findById(productId);

        upload.array('newImages', 6)(req, res, async (err) => {
            if (err) {
                console.error(err);
                res.redirect('/admin/products'); 
                return;
            }
            let removedImages = [];
            if (Array.isArray(req.body.removeImages)) {
                removedImages = req.body.removeImages.filter(removedImage =>
                    product.productImage.includes(removedImage)
                );
            } else if (product.productImage.includes(req.body.removeImages)) {
                removedImages = [req.body.removeImages];
            }

            product.productImage = product.productImage.filter(image =>
                !removedImages.includes(image)
            );

            removedImages.forEach(removedImage => {
                const imagePath = path.join(__dirname, '..', 'public', 'assets', 'imgs', 'category', removedImage);

                fs.unlink(imagePath, (err) => {
                    if (err) {
                        console.error(`Error removing image: ${err.message}`);
                    } else {
                        console.log('Image removed successfully.');
                    }
                });
            });

            product.productName = req.body.productTitle;
            product.productDescription = req.body.productDescription;
            product.brandName = req.body.brandName;
            product.price = req.body.costInINR;
            product.category = req.body.category;

            if (req.files) {
                for (const image of req.files) {
                    product.productImage.push(image.filename);
                }
            }
            await product.save();

            res.redirect('/admin/products');
        });
    } catch (error) {
        console.error(error);
        res.redirect('/admin/products');
    }
};



const deleteProduct = async (req, res) => {
    try {
        const productId = req.query.id;
        const product = await Product.findById(productId);
        if (!product) {
            res.status(404).send('Product not found');
            return;
        }
        res.render('confirmDelete', { product, title: 'Confirm Delete Product' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting the product');
    }
};

const confirmDeleteProduct = async (req, res) => {
    try {
        const productId = req.query.id;
        const product = await Product.findById(productId);

        if (!product) {
            res.status(404).send('Product not found');
            return;
        }
        for (const image of product.productImage) {
            const imagePath = `\Users\dell\Desktop\Project\public\assets\imgs\category${image}`;
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error(`Error removing image: ${err}`);
                }
            });
        }
        await Product.findByIdAndDelete(productId);
        res.redirect('/admin/products');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting the product');
    }
}

const aProductPage = async (req, res) => {
    try {
        const userId = req.session.user;
        const user = await User.findById(userId);
        const productId = req.query.id;
        const product = await Product.findById(productId);
        const categories = await Category.find()

        if (product) {
            res.render('aProduct', { user, product,categories })
        }


    } catch (error) {
        console.log('Error occurred in product controller aProductPage function', error);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    loadProducts,
    addProduct,
    saveProduct,
    editProduct,
    updateProduct,
    deleteProduct,
    confirmDeleteProduct,
    aProductPage
}
