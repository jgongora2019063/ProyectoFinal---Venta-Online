'use strict'

const express = require("express");
const app = express();
const bodyparser = require("body-parser")
const cors = require("cors")

const userController = require('./src/controllers/user.controller')

const user_routes = require('./src/routes/user.routes')

app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())

app.use(cors())

app.use('/api', user_routes)

userController.createAdmin();

module.exports = app;