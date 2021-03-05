'use strict'

const categoryModel = require('../models/category.model')
const Category = require('../models/category.model')
const Product = require('../models/product.model')
const jwt = require('../services/user.jwt')

function addCategory(req,res){
    var categoryModel = new Category();
    var params = req.body;

    if(req.user.rol != 'ROL_ADMIN') return res.status(500).send({ message: 'You dont have the permissions' })

    if(params.name && params.description){
        categoryModel.name = params.name;
        categoryModel.description = params.description;

        Category.find({ $or: [
            { name: params.name }
        ] }).exec((err, categoryFound) => {
            if(err) return res.status(500).send({ mensaje: 'Error in the request' })

            if(categoryFound && categoryFound.length >= 1){
                return res.status(500).send({ mensaje: 'The category already exists' })
            }else {
                categoryModel.save((err, categorySaved) => {
                    if(err) return console.log('Error saving category')

                    if(categorySaved){
                        res.status(200).send(categorySaved)
                    }else {
                        return console.log('The category could not be created')
                    }
                } )
            }
        } )
    }
}

function getCategories(req,res){
    if(req.user.rol != 'ROL_ADMIN') return res.status(500).send({ message: 'You dont have the permissions' })
    
    Category.find((err, categoriesFound) => {
        if(err) return res.status(500).send({ message: 'Error in the request' })
        if(!categoriesFound) return res.status(500).send({ message: 'Error getting the categories' })

        return res.status(200).send({ categoriesFound })
    } )
}

function editCategory(req,res){
    var IdCategory = req.params.IdCategory;
    var params = req.body;

    if(req.user.rol != 'ROL_ADMIN') return res.status(500).send({ message: 'You dont have the permissions' })

    Category.findByIdAndUpdate(IdCategory, params, {new: true, useFindAndModify: false}, (err, editedCategory) => {
        if(err) return res.status(500).send({ message: 'Error in the request' })
        if(!editedCategory) return res.status(500).send({ message: 'Error when editing category' })

        return res.status(200).send({ editedCategory })
    } )
}

function deleteCategory(req,res){
    var IdCategory = req.params.IdCategory;

    if(req.user.rol != 'ROL_ADMIN') return res.status(500).send({ message: 'You dont have the permissions' })

    Category.findById(IdCategory, (err, categoryFound) => {
        if(categoryFound){
            createCategoryDefault

            Category.findOne({ name: 'Default' }, (err, categoryDefaultFound) => {
                if(err) if(err) return res.status(500).send({ message: 'Error in the request' })
                if(!categoryDefaultFound) return res.status(500).send({ message: 'There is no default category' })                
                Product.updateMany({ idCategory: IdCategory },{ idCategory: categoryDefaultFound._id }, (err, editedProduct) => {
                    if(err) return res.status(500).send({ message: 'Error in the request' })
                    if(!editedProduct) return res.status(500).send({ message: 'Error when editing prodructs' })
                })

                Category.findByIdAndDelete(IdCategory, (err, deletedCategory) => {
                    if(err) return res.status(500).send({ message: 'Error in the request' })
                    if(!deletedCategory) return res.status(500).send({ message: 'Error when deleting category' })
                    return res.status(200).send({ deletedCategory })
                })

            } )

        }else {
            return res.status(500).send({ message: 'Category not found' })
        }
    } )
}

function createCategoryDefault(req,res){
    var categoryModel = new Category();
    var name = 'Default';
    var description = 'Categoria Default';

    categoryModel.name = name;
    categoryModel.description = description;

    Category.find({ $or: [
        { name: name }
    ] }).exec((err, categoryFound) => {
        if(err) return res.status(500).send({ mensaje: 'Error in the request' })

        if(categoryFound && categoryFound.length < 1){
            categoryModel.save((err, categorySaved) => {
                if(err) return console.log('Error saving category')
                if(!categorySaved){
                    return console.log('The category could not be created')
                }
            })
        }
    } )  
}

module.exports = {
    addCategory,
    getCategories,
    editCategory,
    deleteCategory,
    createCategoryDefault
}