'use strict'

const userModel = require('../models/user.model')
const User = require('../models/user.model')
const bcrypt = require("bcrypt-nodejs")

function crearAdmin(req,res){
    var userModel = new User();
    var user = 'ADMIN'
    var pass = '123456'
    var rol = 'ROL_ADMIN'

    if(user === 'ADMIN' && pass === '123456' && rol === 'ROL_ADMIN'){
        userModel.user = user;
        userModel.password = pass;
        userModel.rol = rol;
        
        User.find({ $or:[
            { user: userModel.user }
        ] }).exec((err, userFound) =>{
            if(err) return console.log("Error en la petición")

            if(userFound && userFound.length >= 1){
                console.log(`Usuario ${userModel.user} ya existe`)
            }else {
                bcrypt.hash(pass, null, null, (err, passEncrypted) => {
                    userModel.password = passEncrypted;

                    userModel.save((err, userSaved) => {
                        if(err) return console.log('Error al guardar el Usuario')
                        if(userSaved){
                            console.log(userSaved)
                        }else {
                            return console.log('Error al registrar')
                        }
                    })
                })
            }
        })
    }
}

module.exports = {
    crearAdmin
}