'use strict';

const router = require('express').Router();
const Joi = require('joi');
const crypto = require('crypto');
const Cart = require('../models/Cart');
const User = require('../models/user');
const Checkout = require('../models/Checkout');

router.post("/", async(req, res)=>{
    try {
         let user_uuid = req.body.user_uuid;
         if(user_uuid == "" || user_uuid == undefined){
            return res.status(400).send("user id is required.")
         }
         let cart = await Cart.aggregate([
            {
                $match : {
                    user_uuid : user_uuid
                }
            },
            {
                $lookup : {
                    from : 'products',
                    localField : 'item_uuid',
                    foreignField : "uuid",
                    as : 'item'
                }
            }
         ]);

         if(cart.length == 0){
            return res.status(400).send('Cart is Empty.');
         }
         let checkoutData = [];
         let amount = 0;
         let sgst_tax = 0;
         let cgst_tax = 0;
         let is_error = false;
         let message =""
          cart.forEach((c)=>{
            if(c.quantity>c.item[0].stock_quantity){
                is_error = true;
                message = `Item : ${c.item[0].name}, QTY: ${c.quantity} is Not Available.`;
            }
            let d = {
                "_id": c.item[0]._id,
                "type": c.item[0].type,
                "price": c.item[0].price,
                "is_active": c.item[0].is_active,
                "is_deleted": c.item[0].is_deleted,
                "name": c.item[0].name,
                "category_uuid": c.item[0].category_uuid,
                "quantity": c.quantity,
                "createdAt": c.item[0].createdAt,
                "updatedAt": c.item[0].updatedAt,
                "uuid": c.item[0].uuid,
            }
            amount = amount + c.quantity * c.item[0].price;
            checkoutData.push(d)
          }) 
          if(is_error){
            return res.status(400).send(message);
          }
          let data = {
            details : checkoutData,
            amount : amount,
            total_amount : (amount + sgst_tax + cgst_tax).toFixed(2),
            user_uuid : user_uuid
          }
         let result = await Checkout.create(data);
         return res.status(200).send({
           success : true,
           data : result
         })
    } catch (error) {
        return res.status(400).send(error.message);
    }
});

module.exports = router
