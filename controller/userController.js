const User = require('../models/UserModel')
const Product = require('../models/ProductModel')
const Category = require('../models/categoryModel')
const Order = require('../models/orderModel')
const bcrypt = require('bcrypt')
const twilio = require('twilio')
const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
    } catch (error) {
        console.log(error.message);
    }
}

const loadSignup = async (req, res, next) => {
    try {
        if (req.session.user_id) {
            return res.redirect('/home')
        } else {
            res.render('signup', { title: 'SignUp Page', message: '' })
        }
    }
    catch (error) {
        console.log(error.message)
    }
}
const insertUser = async (req, res, next) => {
    try {
        const emailMatch = await User.findOne({ email: req.body.email })
        if (emailMatch) {
            res.render('signup', { message: "Email already exists. Try again" })
        } else {
            const spassword = await securePassword(req.body.password)
            const user = new User({
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                password: spassword,
                is_admin: 0
            })
            const userData = await user.save()
            if (userData) {
                res.render('home', { message: "your registration has been successfully." });
            }
            else {
                res.render('signup', { message: "your registration has been failed." });
            }
        }
    }
    catch (error) {
        console.log(error.message)
    }
}

const sendOTP = async (req, res) => {
    const twilioSID = process.env.twilioSID;
    const twilioAuthToken = process.env.twilioAuthToken;
    const twilioPhoneNumber = process.env.twilioPhoneNumber;
    const twilioClient = twilio(twilioSID, twilioAuthToken);
    const generatedOTP = Math.floor(100000 + Math.random() * 900000);
    const phone = req.query.phone;

    twilioClient.messages
        .create({
            to: '+91' + phone,
            from: twilioPhoneNumber,
            body: `Your OTP is: ${generatedOTP}`,
        })
        .then(() => {
            res.send({
                message: 'OTP sent successfully.',
                generatedOTP: generatedOTP,
            });
        })
        .catch((error) => {
            console.error('Error sending OTP:', error);
            res.status(500).send('Failed to send OTP. Please try again.');
        });
};

const loadLogin = async (req, res, next) => {
    try {
        if (req.session.user_id) {
            return res.redirect('/home')
        } else {
            res.render('login', { title: 'Login Page', message: '' })
        }
    }
    catch (error) {
        console.log(error.message)
    }
}

const ITEMS_PER_PAGE = 4;

const loadHome = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const searchQuery = req.query.search;
        const categoryFilter = req.query.category;
        const categories = await Category.find();

        const filter = {
            $or: [
                { productName: { $regex: new RegExp(searchQuery, 'i') } },
                { productDescription: { $regex: new RegExp(searchQuery, 'i') } },
            ],
        };

        if (categoryFilter) {
            filter.category = categoryFilter;
        }

        // Count total number of products based on the filter
        const totalProducts = await Product.countDocuments(filter);

        // Calculate the total number of pages
        const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);

        // Fetch products for the current page
        const products = await Product.find(filter)
            .skip((page - 1) * ITEMS_PER_PAGE)
            .limit(ITEMS_PER_PAGE);

        res.render('home', {
            product: products,
            searchQuery,
            categoryFilter,
            categories,
            currentPage: page,
            totalPages,
        });
    } catch (error) {
        console.log(error.message);
    }
};




const varifyUser = async (req, res, next) => {
    const email = req.body.email
    const password = req.body.password
    const userData = await User.findOne({ email: email })
    if (userData) {
        const passwordMatch = await bcrypt.compare(password, userData.password)
        if (passwordMatch) {
            req.session.user_id = userData._id
            res.redirect('/home')
        } else {
            res.render('login', { message: "Email and password is incorrect" })
        }
    } else {
        res.render('login', { message: "Email and password is incorrect" })
    }
}

const signout = (req, res) => {
    req.session.destroy();
    res.redirect('/login');
}

const loadProfile = async (req, res) => {
    try {
        const userId = req.session.user_id;
        const user = await User.findById(userId);
        const categories = await Category.find();
        
        // Populate the orders with product details
        const orders = await Order.find({ user: userId }).populate({
            path: 'products.product',
            model: 'products',
        });

        const address = user.addresses;
        res.render('userProfile', { user, categories, address, orders });

    } catch (error) {
        console.log("user controller userProfile error", error);
    }
};

const updateUserProfile = async (req, res) => {
    const { name, phone, addresses } = req.body; // Modify to handle an array of addresses
    const userId = req.session.user_id;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { name, phone, addresses }, // Update the addresses field
            { new: true }
        );

        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ error: 'Error updating user profile' });
    }
};


const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.session.user_id;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const passwordMatch = await bcrypt.compare(oldPassword, user.password);

        if (!passwordMatch) {
            return res.status(400).json({ error: 'Incorrect old password' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ error: 'Error changing password' });
    }
};

const addAddress = async(req, res) => {
    try {
        const userId = req.body.userId;

        const { streetAddress, city, state, zipCode } = req.body;

        const newAddress = {
            street: streetAddress,
            city: city,
            state: state,  
            postalCode: zipCode
        };

        const user = await User.findByIdAndUpdate(userId, { $push: { addresses: newAddress } }, { new: true });

        res.status(200).json({ message: 'Address added successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const removeAddress = async (req, res) => {
    try {
        const userId = req.session.user_id;
        const { index } = req.body;

        // Find the user by ID
        const user = await User.findById(userId);

        // Remove the address at the specified index
        user.addresses.splice(index, 1);

        // Save the updated user
        await user.save();

        res.status(200).json({ message: 'Address removed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = {
    loadSignup,
    insertUser,
    sendOTP,
    loadLogin,
    loadHome,
    varifyUser,
    signout,
    loadProfile,
    updateUserProfile,
    changePassword,
    addAddress,
    removeAddress
}