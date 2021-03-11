'use strict'

const express = require("express");
const app = express();
const bodyparser = require("body-parser")
const cors = require("cors")

const userController = require('./src/controllers/user.controller')

const user_routes = require('./src/routes/user.routes')
const category_routes = require('./src/routes/category.routes')
const product_routes = require('./src/routes/product.routes')
const cart_routes = require('./src/routes/shoppingCart.routes')
const bill_routes = require('./src/routes/bill.routes')

app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())

app.use(cors())

app.use('/api', user_routes)
app.use('/api', category_routes)
app.use('/api', product_routes)
app.use('/api', cart_routes)
app.use('/api', bill_routes)

userController.createAdmin();

module.exports = app;