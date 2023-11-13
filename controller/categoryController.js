const Category = require('../models/categoryModel')

const loadCategory = async (req, res) => {
    try {
        res.setHeader('cache-control', 'no-cache, no-store, must-revalidate');
        const sort = req.query.sort || 'id';
        const sortCriteria = {};
        sortCriteria[sort] = 1;
        const categories = await Category.find().sort(sortCriteria);
        res.render('category', { categories, title: 'Admin Category Management' });
    } catch (error) {
        console.log(error.message);
    }
}
const addCategory = async (req, res) => {
    const categoryName = req.body.product_name.trim(); // Assuming the input field has the name attribute 'product_name'

    try {
        // Check if the category already exists
        const existingCategory = await Category.findOne({ categoryName });

        if (existingCategory) {
            // Category already exists, handle accordingly (e.g., send an error response)
            return res.status(400).json({ error: 'Category already exists' });
        }

        // Category doesn't exist, add it to the database
        const newCategory = new Category({
            categoryName,
            is_list: 1
        });
        await newCategory.save();

        // Handle success (e.g., send a success response)
        res.status(200).redirect('/admin/categories');
    } catch (error) {
        // Handle any errors (e.g., send an error response)
        console.error(err);
        res.status(500).send('Error adding category');
        res.redirect('/admin/categories')
    }
}

const unlistCategory = async (req, res) => {
    try {
        res.setHeader('cache-control', 'no-cache, no-store, must-revalidate');
        const categoryID = req.query.category
        const category = await Category.findOne({ _id: categoryID })
        if (category) {
            if (category.is_list == 1) {
                category.is_list = 0
            } else {
                category.is_list = 1
            }

            await category.save();
            res.redirect('/admin/categories')
        } else {
            res.redirect('/admin/categories')
        }
    } catch (error) {
        console.log(error.message);
    }
}

const deleteCategory = async (req, res) => {
    try {
        res.setHeader('cache-control', 'no-cache, no-store, must-revalidate');
        const categoryID = req.query.category;
        const category = await Category.findOne({ _id: categoryID });
        if (category) {
            await Category.deleteOne({ _id: categoryID });
            res.redirect('/admin/categories');
        } else {
            res.redirect('/admin/categories');
        }
    } catch (error) {
        console.log(error.message);
        res.redirect('/admin/categories');
    }
}


const confirmDeleteCategory = async (req, res) => {
    const categoryID = req.query.category;
    const category = await Category.findById(categoryID)
    res.render('confirmDeleteCategory', { category,title:'Confirm Detele Category' });
}

module.exports = {
    loadCategory,
    addCategory,
    unlistCategory,
    confirmDeleteCategory,
    deleteCategory
}

