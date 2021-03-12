'use strict'

const mongoose = require("mongoose")
const Schema = mongoose.Schema;

var ProductSchema = Schema({
    name: String,
    description: String,
    price: Number,
    brand: String,
    amount: Number,
    quantitySold: {type: Number, default: 0},
    idCategory: {type: Schema.Types.ObjectId, ref: 'categories'}
})

module.exports = mongoose.model('products', ProductSchema)