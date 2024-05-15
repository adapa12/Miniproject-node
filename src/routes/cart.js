'use strict'

const router = require('express').Router()
const Joi = require('joi');
const Cart = require('../models/Cart');
const Product = require('../models/product');
const User = require('../models/user');


router.post("/add", async(req, res)=>{
    try {
         const SchemaValidate = Joi.object({
            item_uuid : Joi.string().required(),
            quantity : Joi.number().required(),
            user_uuid : Joi.string().allow(''),
            ip_address : Joi.string().allow('')
         });

         let validData = await SchemaValidate.validateAsync(req.body);

         let checkProduct = await Product.findOne({uuid:validData.item_uuid});
         if((checkProduct.stock_quantity < validData.quantity)){
          return res.status(400).send("Out of Stock");
         }

        if(
            (validData.user_uuid == "" || validData.user_uuid == undefined)&&
            (validData.ip_address == "" || validData.ip_address == undefined)
            ){
                return res.status(400).send("Either Employee or as guest need.")
            }
        if(validData.user_uuid != "" && validData.user_uuid != undefined){
            let checkItem = await Cart.findOne({item_uuid:validData.item_uuid,user_uuid:validData.user_uuid});
            if(checkItem){
                checkItem.quantity = checkItem.quantity + validData.quantity;
                await checkItem.save();
            }else{
                await Cart.create(validData);
            }
        }
        if(validData.ip_address != "" && validData.ip_address != undefined){
            let checkItem = await Cart.findOne({item_uuid:validData.item_uuid,ip_address:validData.ip_address});
            if(checkItem){
                checkItem.quantity = checkItem.quantity + validData.quantity;
                await checkItem.save();
            }else{
                await Cart.create(validData);
            }
        }

        return res.status(200).send({
            success : true,
            message : "Successfully Added."
        })
    } catch (error) {
        return res.status(400).send(error.message);
    }
})

module.exports = router