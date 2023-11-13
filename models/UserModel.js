const mongoose = require('mongoose')
const userSchema = mongoose.Schema({

    name:{
    type : String,
    required : true
    },

    email:{
        type:String,
        required : true
    },

    password:{
        type:String,
        required:true
    },

    phone:{
        type:String,
        required:true
    },
    
    is_admin:{
        type:Number,
        required:true
    },
    is_blocked:{
        type:Number,
        required:true
    }

})

module.exports = mongoose.model('users',userSchema)