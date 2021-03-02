'use strict'

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var CategorySchema = Schema({
    name: String,
    description: String
})

module.exports = mongoose.model('categories', CategorySchema)