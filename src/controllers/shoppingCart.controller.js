'use strict'

const Cart = require('../models/shoppingCart.model');
const cartModel = require('../models/shoppingCart.model')
const Product = require('../models/product.model')
const jwt = require('../services/user.jwt');


function createCart(idUser,res){
    var cartModel = new Cart();
    var IdUser = idUser;

    cartModel.idUser = IdUser;

    Cart.find({ $or: [ 
        { idUser: IdUser }
     ] }).exec((err, cartFound) => {
        if(err) return res.status(500).send({ message: 'Error in the request' })
        if(cartFound && cartFound.length < 1 ){
            cartModel.save((err, cartSaved) => { 
                if(err) return res.status(500).send({ message: 'Error creating cart' })

                if(!cartSaved){
                    return console.log('The cart could not be created')
                }
            } )
        }
     })
    
}

function addProductToCart(req,res){
    var params = req.body;

    if(req.user.rol != 'ROL_CLIENT') return res.status(500).send({ message: 'You dont have the permissions' })

   Product.findById(params.idProduct, (err, productFoundY) => {
        if(err) return res.status(500).send({ message: 'Error in the request' })
        if(!productFoundY) return res.status(500).send({ message: 'Product doesnt exists' })

        if(params.amount <= 0 ) return res.status(500).send({ message: 'Must be greater than zero' })
            
        
        if(params.amount > productFoundY.amount) return res.status(500).send({ message: 'Not enough units' })

        /*Cart.findOne({idUser: req.user.sub}, (err, cartFound) => {
            if(err) return res.status(500).send({ message: 'Error in the request' })

            if(cartFound.idProduct === params.idProduct){
                params.amount = cartFound.amount+params.
            }*/

        
        
            Cart.findOneAndUpdate({ idUser: req.user.sub }, { $push: { product: {idProduct: params.idProduct, amount: params.amount} }},
                {new: true, useFindAndModify: false}, (err, cartAdded) => {
                    if(err) return res.status(500).send({ message: 'Error in the request' })
                    if(!cartAdded) return res.status(500).send({ message: 'Error adding the product' })
            
                    Product.findById(params.idProduct, (err, productFound) => {
                        if(err) return res.status(500).send({ message: 'Error in the request' })
                        if(!productFound) return res.status(500).send({ message: 'Error getting the product' })
                        var amountP = params.amount;
                        var priceP = productFound.price;
                        var cartTotalP = cartAdded.total;
                            
            
                        var totalF = cartTotalP +(priceP*amountP);
            
                        Cart.findOneAndUpdate({ idUser: req.user.sub }, { total: totalF}, { new: true, useFindAndModify: false }, (err, cartTotal) => {
                            if(err) return res.status(500).send({ message: 'Error in the request' })
                            if(!cartTotal) return res.status(500).send({ message: 'Error added the total' })
            
                            return res.status(200).send({ cartTotal })
                        } )
            
                    } )
            } )
        //} )
   })


}

function deleteCart(IdUser,res){

    Cart.findOneAndDelete({ idUser: IdUser }, (err, cartDeleted) => {
        if(err) return res.status(500).send({ message: 'Error in the request' })
        if(!cartDeleted) return res.status(500).send({ message: 'Error deleting the cart' })

    } )
}

module.exports = {
    createCart,
    addProductToCart,
    deleteCart
}