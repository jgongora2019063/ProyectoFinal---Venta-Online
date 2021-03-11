'use strict'

const mongoose = require("mongoose")
var Schema = mongoose.Schema;

var BillSchema = Schema({
    idUser: { type: Schema.Types.ObjectId, ref: 'users' },
    products: [{
        idProduct: { type: Schema.Types.ObjectId, ref: 'products' },
        amount: Number
    }],
    total: { type: Number, default: 0 }
})

module.exports = mongoose.model('bills', BillSchema)