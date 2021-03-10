'use strict'

const userModel = require('../models/user.model')
const User = require('../models/user.model')
const Product = require('../models/product.model')
const cartController = require('../controllers/shoppingCart.controller')
const bcrypt = require("bcrypt-nodejs");
const jwt = require('../services/user.jwt')

function createAdmin(req,res){
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
            if(err) return console.log("Error in the request")

            if(userFound && userFound.length >= 1){
                console.log(`User ${userModel.user} already exists`)
            }else {
                bcrypt.hash(pass, null, null, (err, passEncrypted) => {
                    userModel.password = passEncrypted;

                    userModel.save((err, userSaved) => {
                        if(err) return console.log('Error saving user')
                        if(userSaved){
                            console.log(userSaved)
                        }else {
                            return console.log('Register failed')
                        }
                    })
                })
            }
        })
    }
}

function login(req,res){
    var params = req.body

    User.findOne( { user: params.user }, (err, userFound) => {
        if(err) return res.status(500).send({ message: 'Error in the request' })

        if(userFound){
            bcrypt.compare(params.password, userFound.password, (err, passCorrect) => {
                if(passCorrect){
                    if(params.getToken === 'true'){
                        if(userFound.rol != 'ROL_CLIENT'){
                            return res.status(200).send({ token: jwt.createToken(userFound) })
                        }else {
                            cartController.createCart(userFound._id)
                            return res.status(200).send({ token: jwt.createToken(userFound) })
                        }
                    }else {
                        userFound.password = undefined
                        return res.status(200).send(userFound)
                    }
                }else {
                    return res.status(500).send({ message: 'The user couldnt be identified ' })
                }
            } )
        }else {
            return res.status(500).send({ message: 'The user couldnt be logged in' })
        }
    } )
}

function registerUser(req,res){
    var userModel = new User();
    var params = req.body;

    if(req.user.rol != 'ROL_ADMIN') return res.status(500).send({ message: 'You dont have the permissions' })

    if(params.name && params.lastname && params.user && params.password && params.rol){
        userModel.name = params.name;
        userModel.lastname = params.lastname;
        userModel.user = params.user;
        userModel.rol = params.rol
        

        if(params.rol != 'ROL_ADMIN'){
            return res.status(500).send({ message: 'The rol can only be ROL_ADMIN' })
        }

        User.find({ $or: [
            { user: userModel.user }
        ] }).exec(( err, userFound ) => {
            if(err) return res.status(500).send({ message: 'Error in the request' })

            if(userFound && userFound.length >= 1){
                return res.status(500).sebd({ message: 'The user already exists' })

            }else {
                bcrypt.hash(params.password, null, null, (err, passEncrypted) => {
                    userModel.password = passEncrypted;
                    userModel.save((err, userSaved) => {
                        if(err) return res.status(500).send({ mesa: 'Error saving user' })

                        if(userSaved){
                            res.status(200).send(userSaved)
                        }else {
                            res.status(404).send({ message: 'User couldn´t be registered' })
                        }

                    })
                })
            }
        } )
    }else {
        return res.status(500).send({ message: 'Missing data to enter' })
    }

}

function registerUserClient(req,res){
    var userModel = new User();
    var params = req.body;
    const rolClient = 'ROL_CLIENT'

    delete params.rol

    if(params.name && params.lastname && params.user && params.password ){
        userModel.name = params.name;
        userModel.lastname = params.lastname;
        userModel.user = params.user;
        userModel.rol = rolClient

        User.find({ $or: [
            { user: userModel.user }
        ] }).exec(( err, userFound ) => {
            if(err) return res.status(500).send({ message: 'Error in the request' })

            if(userFound && userFound.length >= 1){
                return res.status(500).send({ message: 'The user already exists' })

            }else {
                bcrypt.hash(params.password, null, null, (err, passEncrypted) => {
                    userModel.password = passEncrypted;
                    userModel.save((err, userSaved) => {
                        if(err) return res.status(500).send({ message: 'Error saving user' })

                        if(userSaved){
                            res.status(200).send(userSaved)
                        }else {
                            res.status(404).send({ message: 'User couldn´t be registered' })
                        }

                    })
                })
            }
        } )
    }
}

function editUser(req,res){
    var IdUser = req.params.IdUser
    var params = req.body;

    delete params.password;

    if(req.user.rol === 'ROL_CLIENT'){
        delete params.rol;
        User.findByIdAndUpdate(IdUser, params, {new: true, useFindAndModify: false}, (err, editedUser) => {
            if(err) return res.status(500).send({ message: 'Error in the request' })
            if(!editedUser) return res.status(500).send({ message: 'The user couldnt not be found' })
            if(editedUser.rol === 'ROL_ADMIN') return res.status(500).send({ message: 'Cannot modify an admin user' })
            if(req.user.sub != editedUser._id) return res.status(500).send({ message: 'You dont have the permissions' })
                    
            return res.status(200).send({ editedUser })
        } )
    }else if(req.user.rol === 'ROL_ADMIN'){
        User.findById(IdUser, (err, userFounByID) => {
            if(err) return res.status(500).send({ message: 'Error in the request' })
            if(!userFounByID) return res.status(500).send({ message: 'The user couldnt not be found' })
            if(userFounByID.rol === 'ROL_ADMIN') return res.status(500).send({ message: 'Cannot modify an admin user' })
            User.findByIdAndUpdate(IdUser, params, {new: true, useFindAndModify: false}, (err, editedUser) => {
                if(params.rol != 'ROL_ADMIN' && params.rol != 'ROL_CLIENT'){
                    return res.status(500).send({ message: 'The rol can only be ROL_ADMIN or ROL_CLIENT' })
                }
                if(err) return res.status(500).send({ message: 'Error in the request' })
                if(!editedUser) return res.status(500).send({ message: 'The user couldnt not be found' })
                if(editedUser.rol === 'ROL_CLIENT') {
                    return res.status(200).send({ editedUser })
                }
                return res.status(200).send({ editedUser })
            } )
        } )
    }

}

function deleteUser(req,res){
    var IdUser = req.params.IdUser;

    if(req.user.rol === 'ROL_CLIENT'){
        User.findById(IdUser, (err, userFounByID) => {
            if(err) return res.status(500).send({ message: 'Error in the request' })
            if(!userFounByID) return res.status(500).send({ message: 'The user couldnt not be found' })
            if(userFounByID.rol === 'ROL_ADMIN') return res.status(500).send({ message: 'Cannot delete an admin user' })
            User.findByIdAndDelete(IdUser, (err, userDeleted) => {
                if(err) return res.status(500).send({ message: 'Error in the request' })
                if(!userDeleted) return res.status(500).send({ message: 'Failed to delete user' })
                if(userDeleted.rol != 'ROL_CLIENT') return res.status(500).send({ message: 'Cannot delete an admin user' })
                if(req.user.sub != userDeleted._id) return res.status(500).send({ message: 'You dont have the permissions' })
        
                return res.status(200).send({ userDeleted })
            } )
        })
    }else if(req.user.rol === 'ROL_ADMIN'){
        User.findById(IdUser, (err, userFounByID) => {
            if(err) return res.status(500).send({ message: 'Error in the request' })
            if(!userFounByID) return res.status(500).send({ message: 'The user couldnt not be found' })
            if(userFounByID.rol === 'ROL_ADMIN') return res.status(500).send({ message: 'Cannot delete an admin user' })
            User.findByIdAndDelete(IdUser, (err, userDeleted) => {
                if(err) return res.status(500).send({ message: 'Error in the request' })
                if(!userDeleted) return res.status(500).send({ message: 'Failed to delete user' })
        
                return res.status(200).send({ userDeleted })
            } )
        })
    }
}

/*function addProductToCart(req,res){
    var IdUser = req.user.sub;
    var params = req.body;

    if(req.user.rol != 'ROL_CLIENT') return res.status(500).send({ message: 'The ROL_ADMIN cannot have a cart' })

    User.findByIdAndUpdate(IdUser,  { $push: { "shoppingCart.products": {  idProduct: params.idProduct, amount: params.amount }}},
        { new: true, useFindAndModify: false }, (err, addedShoppingCart) => {
            if(err) return res.status(500).send({ message: 'Error in the request' })
            if(!addedShoppingCart) return res.status(500).send({ message: 'Error adding the shopping cart' })

            Product.findById(params.idProduct, (err, productFound) => {
                if(err) return res.status(500).send({ message: 'Error in the request' })

                var priceProduct = productFound.price;

            var totalL = priceProduct*params.amount

            User.findByIdAndUpdate(IdUser, {shoppingCart: { total: totalL }}, { new: true, useFindAndModify: false }, (err, productTotal) => {
                if(err) return res.status(500).send({ message: 'Error in the request' })
                if(!productTotal) return res.status(500).send({ message: 'Error adding the shopping cart' })

                
                return res.status(200).send({ productTotal })
            })
        })
    } )
}*/

module.exports = {
    createAdmin,
    login,
    registerUser,
    registerUserClient,
    editUser,
    deleteUser,
    //addProductToCart
}