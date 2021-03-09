'use strict'

const mongoose = require("mongoose")
var Schema = mongoose.Schema;

var UserSchema = Schema({
    name: String,
    lastname: String,
    user: String,
    password: String,
    rol: String,
    shoppingCart: {
        products: [{
            idProduct: { type: Schema.Types.ObjectId, ref: 'products' },
            amount: Number
        }],
        total: Number
    }
})

module.exports = mongoose.model('users', UserSchema)