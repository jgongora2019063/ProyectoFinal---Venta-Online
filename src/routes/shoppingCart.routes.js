'use strict'

const express = require("express")
const cartController = require('../controllers/shoppingCart.controller')

var md_authentication = require('../middlewares/user.authenticated')

var api = express.Router()

api.put('/addProductToCart', md_authentication.ensureAuth, cartController.addProductToCart)

module.exports = api;