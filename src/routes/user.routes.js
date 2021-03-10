'use strict'

const express = require("express")
const userController = require('../controllers/user.controller')
const md_authentication = require('../middlewares/user.authenticated')

var api = express.Router()

api.post('/login', userController.login);
api.post('/registerUser', md_authentication.ensureAuth, userController.registerUser);
api.post('/registerClient', userController.registerUserClient);
api.put('/editUser/:IdUser', md_authentication.ensureAuth, userController.editUser);
api.delete('/deleteUser/:IdUser', md_authentication.ensureAuth, userController.deleteUser);

module.exports = api
