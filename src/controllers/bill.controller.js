'use strict'

const Bill = require('../models/bill.model')
const Product = require('../models/product.model')
const Cart = require('../models/shoppingCart.model')
const cartController = require('../controllers/shoppingCart.controller')

function confirmPurchase(req,res){
    var IdUser = req.params.IdUser;

    if(req.user.rol != 'ROL_ADMIN') return res.status(500).send({ message: 'You dont have the permissions' })

    Cart.findOne({ idUser: IdUser }, (err, cartFound) => {
        if(err) return res.status(500).send({ message: 'Error in the request' })
        if(!cartFound) return res.status(500).send({ message: 'Error getting the car' })

        if(cartFound.total === 0) return res.status(500).send({ message: 'Empty cart' })

        var billModel = new Bill();

        billModel.idUser = cartFound.idUser;
        billModel.products = cartFound.product;
        billModel.total = cartFound.total;

        

        cartController.deleteCart(IdUser); // Function to delete a cart on shoppingCartController

        cartController.createCart(IdUser); // // Function to create a cart on shoppingCartController


        billModel.save((err, billSaved) => {
            if(err) return res.status(500).send({ message: 'Error in the request' })
            if(!billSaved) return res.status(500).send({ message: 'Errro saving the bill' })

            return res.status(200).send({ billSaved })
        })

    } )

}

function getDetailedBill(req,res){
    var idBill = req.params.IdBill;

    if(req.user.rol != 'ROL_CLIENT') return res.status(500).send({ message: 'You dont have the permissions' })

    Bill.findById(idBill,(err, billFound) =>{
        if(err) return res.status(500).send({ message: 'Error in the request' })
        if(!billFound) return res.status(500).send({ message: 'Error getting the bills' })
        if(billFound.idUser != req.user.sub) return res.status(500).send({ message: 'The bill does not belong to you' })

        return res.status(200).send({ billFound })
    } ).populate('products.idProduct', 'name price')
}

function getBills(req,res){
    if(req.user.rol != 'ROL_ADMIN') return res.status(500).send({ message: 'You dont have the permissions' })

    Bill.find((err, billsFounds) =>{
        if(err) return res.status(500).send({ message: 'Error in the request' })
        if(!billsFounds) return res.status(500).send({ message: 'Error getting the bills' })

        return res.status(200).send({ billsFounds })
    } ).populate('products.idProduct', 'name price')
}

function getProducts(req,res){
    var IdBill = req.params.IdBill;

    if(req.user.rol != 'ROL_ADMIN') return res.status(500).send({ message: 'You dont have the permissions' })

    Bill.findById(IdBill, {_id:0 ,total:0,idUser:0}, (err, billFound) => {
        if(err) return res.status(500).send({ message: 'Error in the request' })
        if(!billFound) return res.status(500).send({ message: 'Error getting the bill' })

        return res.status(200).send({ billFound })
    } ).populate('products.idProduct', 'name price')
}

module.exports = {
    confirmPurchase,
    getDetailedBill,
    getBills,
    getProducts
}