const mongoose = require('mongoose')
const categorySchema = mongoose.Schema({

    categoryName:{
        type:String,
        required:true
    },
    is_list:{
        type:Number,
        required:true
    }

})

module.exports = mongoose.model('categories',categorySchema)