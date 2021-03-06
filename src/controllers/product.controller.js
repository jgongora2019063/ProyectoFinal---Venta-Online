'use strict'

const productModel = require('../models/product.model');
const Product = require('../models/product.model')
const jwt = require('../services/user.jwt')

function addProduct(req,res){
    var productModel = new Product();
    var params = req.body;

    if(params.name &&  params.description && params.price && params.brand && params.amount && params.idCategory){
        productModel.name = params.name;
        productModel.description = params.description;
        productModel.price = params.price;
        productModel.brand = params.brand
        productModel.amount = params.amount;
        productModel.idCategory = params.idCategory;

        if(req.user.rol != 'ROL_ADMIN') return res.status(500).send({ message: 'You dont have the permissions' })

        Product.find({ name: params.name, brand: params.brand }, (err, productFound) => { 
            if(err) return res.status(500).send({ message: 'Error in the request' })
            
            if(productFound && productFound.length >= 1){
                return res.status(500).send({ message: 'Product already exists' })
            }else {
                productModel.save((err, productSaved) => {
                    if(err) return res.status(500).send({ message: 'Error saving the product' })

                    if(productSaved){
                        res.status(200).send({ productSaved })
                    }else {
                        res.status(404).send({ message: 'The product could not be added' })
                    }
                } )
            }
        } )
    }
}

function editProduct(req,res){
    var IdProduct = req.params.IdProduct;
    var params = req.body;

    if(req.user.rol != 'ROL_ADMIN') return res.status(500).send({ message: 'You dont have the permissions' })

    Product.findByIdAndUpdate(IdProduct, params, {new: true, useFindAndModify: false}, (err, editedProduct) => {
        if(err) return res.status(500).send({ message: 'Erron in the request' })
        if(!editedProduct) return res.status(500).send({ message: 'Error when editing product' })

        return res.status(200).send({ editedProduct })
    } )
}

function deleteProduct(req,res){
    var IdProduct = req.params.IdProduct;

    if(req.user.rol != 'ROL_ADMIN') return res.status(500).send({ message: 'You dont have the permissions' })

    Product.findByIdAndDelete(IdProduct, (err, deletedProduct) => {
        if(err) return res.status(500).send({ message: 'Erron in the request' })
        if(!deletedProduct) return res.status(500).send({ message: 'Error when deleting product' })

        return res.status(200).send({ deletedProduct })
    } )
}

function getProductById(req,res){
    var IdProduct = req.params.IdProduct;

    if(req.user.rol != 'ROL_ADMIN') return res.status(500).send({ message: 'You dont have the permissions' })

    Product.findById(IdProduct, (err, productFound) => {
        if(err) return res.status(500).send({ message: 'Error in the request' })
        if(!productFound) return res.status(500).send({ message: 'Error getting the product' })

        return res.status(200).send({ productFound })
    } ).populate('idCategory', 'name')
}

function getProducts(req,res){
    if(req.user.rol != 'ROL_ADMIN') return res.status(500).send({ message: 'You dont have the permissions' })

    Product.find((err, productsFound) => {
        if(err) return res.status(500).send({ message: 'Error in the request' })
        if(!productsFound) return res.status(500).send({ message: 'Error getting the product' })

        return res.status(200).send({ productsFound })
    } ).populate('idCategory', 'name')
}

function getProductByName(req,res){
    var params = req.body;

    //if(req.user.rol != 'ROL_ADMIN') return res.status(500).send({ message: 'You dont have the permissions' })

    if(params.name){

        Product.aggregate([
            {
                $match: { name: { $regex: params.name, $options: 'i' } }
            }
        ]).exec((err, productsFound) => {
            return res.status(200).send({ productsFound })
        } )
    }else {
        return res.status(500).send({ message: 'One field is missing for full' })
    }

}

module.exports = {
    addProduct,
    editProduct,
    deleteProduct,
    getProductById,
    getProducts,
    getProductByName
}