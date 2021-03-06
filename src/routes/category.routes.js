'use strict'

const express = require("express")
const categoryController = require('../controllers/category.controller')

var md_authentication = require('../middlewares/user.authenticated')

var api = express.Router()

api.post('/addCategory', md_authentication.ensureAuth, categoryController.addCategory);
api.get('/getCategories', md_authentication.ensureAuth, categoryController.getCategories);
api.put('/editCategory/:IdCategory', md_authentication.ensureAuth, categoryController.editCategory);
api.delete('/deleteCategory/:IdCategory', md_authentication.ensureAuth, categoryController.deleteCategory);
api.get('/getProductsByCategory', md_authentication.ensureAuth, categoryController.getProductByCategory)

module.exports = api;