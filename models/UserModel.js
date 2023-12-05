const mongoose = require('mongoose')
const userSchema = mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
    },

    is_admin: {
        type: Number,
        required: true
    },
    is_blocked: {
        type: Number,
        required: true
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart'
    },
    addresses: [
        {
            street: String,
            city: String,
            state: String,
            postalCode: String,
        }
    ],

})

module.exports = mongoose.model('users', userSchema)