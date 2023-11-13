const Admin = require('../models/UserModel')
const bcrypt = require('bcrypt')

const loadLogin = async (req, res) => {
    try {
        if (req.session.admin_id) {
            return res.redirect('/admin/dashboard');
        } else {
            res.render("adminlogin", { message: '' }); 
        }
    } catch (error) {
        console.log(error.message);
    }
}


const varifyLogin =  async(req,res,next)=>{
    try{
        const email = req.body.email
        const password =  req.body.password
        const AdminData = await Admin.findOne({email:email})
        if(AdminData){
            const passMatch = bcrypt.compare(password,AdminData.password)
            if(passMatch){
                if(AdminData.is_admin==0){
                    res.render('adminlogin',{message:"Email and Password invalid"})
                }else{
                    req.session.admin_id=AdminData._id
                    res.redirect('/admin/dashboard')
                }
            }else{
                res.render('adminlogin',{message:"Email and Password invalid"})
            }
        }else{
            res.render('adminlogin',{message:"Email and Password invalid"})
        }
    }catch (error) {
        console.log(error.message);
    }
}

const loadDashboard = async(req,res,next)=>{
    try{
        const userData = await Admin.find({is_admin:0})
        res.render('dashboard',{userData,title:'Admin Dashboard'})
    }catch (error) {
        console.log(error.message);
    }
}

const logout = async (req, res, next) => {
    try {
        req.session.destroy()
        res.redirect('/admin')
    } catch (error) {
        console.log(error.message)
    }
}

const loadUsers = async (req, res, next) => {
    try {
        const sort = req.query.sort || 'id'; 
        const sortCriteria = {};
        sortCriteria[sort] = 1; 

        const userData = await Admin.find({ is_admin: 0 }).sort(sortCriteria);
        res.render('customers', { userData ,title:'User Management'});
    } catch (error) {
        console.log(error.message);
    }
}

const changeStatus = async(req,res)=>{
    try{
        const userId = req.query.user
        const userData = await Admin.findOne({_id:userId})
        res.render('confirmStatus',{userData,title:'Confirm User Status'})
    }catch(error){
        console.log(error.message)
    }
}

const blockUser = async (req, res, next) => {
    try {
        const userID = req.query.user
        const userData = await Admin.findOne({ _id: userID })
        if (userData) {
            userData.is_blocked = 1
            await userData.save();
            res.redirect('/admin/users')
        } else {
            res.redirect('/admin/users')
        }
    } catch (error) {
        console.log(error.message);
    }
}

const unblockUser = async (req, res, next) => {
    try {
        const userID = req.query.user
        const userData = await Admin.findOne({ _id: userID })
        if (userData) {
            userData.is_blocked = 0
            await userData.save();
            res.redirect('/admin/users')
        } else {
            res.redirect('/admin/users')
        }
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    loadLogin,
    varifyLogin,
    loadDashboard,
    logout,
    loadUsers,
    changeStatus,
    blockUser,
    unblockUser
}