'use strict'

const express = require("express")
const productController = require('../controllers/product.controller')

var md_authentication = require('../middlewares/user.authenticated')

var api = express.Router()

api.post('/addProduct', md_authentication.ensureAuth, productController.addProduct);
api.put('/editProduct/:IdProduct', md_authentication.ensureAuth, productController.editProduct);
api.delete('/deleteProduct/:IdProduct', md_authentication.ensureAuth, productController.deleteProduct);
api.get('/getProductbyId/:IdProduct', md_authentication.ensureAuth, productController.getProductById);
api.get('/getProducts', md_authentication.ensureAuth, productController.getProducts);
api.get('/getProductByName', productController.getProductByName);
api.get('/stockControl/:IdProduct', md_authentication.ensureAuth, productController.stockControl)
api.get('/outOfStockProducts', md_authentication.ensureAuth, productController.outOfStockProducts)


module.exports = api;

