'use strict'

const express = require("express")
const billController = require('../controllers/bill.controller')

var md_authentication = require('../middlewares/user.authenticated')

var api = express.Router()

api.get('/confirmPurchase/:IdUser', md_authentication.ensureAuth, billController.confirmPurchase);
api.get('/getDetailedBill/:IdBill', md_authentication.ensureAuth, billController.getDetailedBill);
api.get('/getBills', md_authentication.ensureAuth, billController.getBills);
api.get('/getProductsByBill/:IdBill', md_authentication.ensureAuth, billController.getProducts)

module.exports = api;