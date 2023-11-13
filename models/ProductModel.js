const mongoose = require('mongoose')
const productSchema = mongoose.Schema({
    productName:{
        type:String,
        requires:true
    },
    productDescription:{
        type:String,
        required:true
    },
    brandName:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },

    category:{
        type:String,
        required:true
    },
    
    productImage: [{
        type: String,
        required: true
    }]    
})

module.exports = mongoose.model('products',productSchema);