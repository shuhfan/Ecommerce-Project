const User = require('../models/UserModel')
const Product = require('../models/ProductModel')
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
            res.setHeader('Cache-Control', 'no-cache', 'no-store', 'must-revalidate')
            res.render('signup',{title:'SignUp Page',message:''})
        }
    }
    catch (error) {
        console.log(error.message)
    }
}
const insertUser = async (req, res, next) => {
    try {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
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
            res.setHeader('Cache-Control', 'no-cache', 'no-store', 'must-revalidate')
            res.render('login',{title:'Login Page',message:''})
        }
    }
    catch (error) {
        console.log(error.message)
    }
}

const loadHome = async (req, res, next) => {
    try {
        const product = await Product.find()
        res.render('home',{product})
    }
    catch (error) {
        console.log(error.message)
    }
}

const varifyUser = async (req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache', 'no-store', 'must-revalidate')
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

module.exports = {
    loadSignup,
    insertUser,
    sendOTP,
    loadLogin,
    loadHome,
    varifyUser,
    signout
}