'use strict'

const express = require("express");
const app = express();
const bodyparser = require("body-parser")
const cors = require("cors")

const userController = require('./src/controllers/user.controller')

userController.crearAdmin();

module.exports = app;