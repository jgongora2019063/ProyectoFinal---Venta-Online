'use strict'

const mongoose = require("mongoose")
var Schema = mongoose.Schema;

var UserSchema = Schema({
    name: String,
    lastname: String,
    user: String,
    password: String,
    rol: String
})

module.exports = mongoose.model('users', UserSchema)