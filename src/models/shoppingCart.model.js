'use strict'

const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CartSchema = Schema({
    idUser: { type: Schema.Types.ObjectId, ref: 'users' },
    product: [{
        idProduct: {type: Schema.Types.ObjectId, ref: 'products'},
        amount: Number
    }],
    total: {type: Number, default: 0}
})

module.exports = mongoose.model('carts', CartSchema)