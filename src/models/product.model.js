'use strict'

const mongoose = require("mongoose")
const Schema = mongoose.Schema;

var ProductSchema = Schema({
    name: String,
    description: String,
    price: Number,
    brand: String,
    amount: Number,
    quantitysold: Number,
    idCategory: {type: Schema.Types.ObjectId, ref: 'categories'}
})

module.exports = mongoose.model('products', ProductSchema)