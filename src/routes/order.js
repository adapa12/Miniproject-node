'use strict';

const router = require('express').Router();
const Joi = require('joi');
const crypto = require('crypto');
const Razorpay = require("razorpay")
const Cart = require('../models/Cart');
const User = require('../models/user');
const Checkout = require('../models/Checkout');
const Order = require('../models/Order');

var instance = new Razorpay({
    key_id: "rzp_test_7QFBAvuokodRy5",
    key_secret: "EWhRezToiNRdQjkVCffFDkEw"
});

router.post("/create", async (req, res) => {
    try {
        let OrderSchema = Joi.object({
            checkout_uuid: Joi.string().required(),
            user_uuid: Joi.string().required(),
            delivery_address: Joi.object({
                first_name: Joi.string().required(),
                last_name: Joi.string().required(),
                mobile: Joi.string().required(),
                city: Joi.string().required(),
                state: Joi.string().required(),
                pincode: Joi.number().required(),
                address: Joi.string().required()
            }).required(),
        });

        const validData = await OrderSchema.validateAsync(req.body);

        let checkoutData = await Checkout.findOne({
            uuid: validData.checkout_uuid,
            user_uuid: validData.user_uuid
        });

        if (!checkoutData) {
            return res.status(400).send("Something went wrong!");
        }

        let transaction_id = 'TRANS-' + crypto.pseudoRandomBytes(4).toString('hex').toUpperCase();

        let orderData = {
            details: checkoutData.details,
            user_uuid: checkoutData.user_uuid,
            checkout_uuid: validData.checkout_uuid,
            amount: checkoutData.amount,
            total_amount: checkoutData.total_amount,
            online_payment: checkoutData.total_amount,
            transaction_uuid: transaction_id,
            payment_status: 'pending',
            delivery_address: validData.delivery_address,
        }

        let result = await Order.create(orderData);
        await Cart.deleteMany({ user_uuid: validData.user_uuid });

        var options = {
            amount: Math.floor((checkoutData.total_amount) * 100),
            currency: 'INR',
            receipt: transaction_id
        };

        instance.orders.create(options, async function (err, order) {
            await Order.updateMany({ transaction_uuid: transaction_id }, { paymentgateway_id: order.id })
            return res.status(200).send({
                status: true,
                message: "Checkout Success",
                data: {
                    transaction_id: transaction_id,
                    razorpay_id: order.id,
                    total: checkoutData.total_amount,
                    item: checkoutData.details,
                }
            });
        });
    } catch (error) {
        return res.status(400).send(error.message);
    }
});

router.post('/payment/update', async (req, res) => {
    try {

        const UpdateSchema = Joi.object({
            order_uuid: Joi.string().required(),
            transaction_uuid: Joi.string().required(),
            payment_status: Joi.string().valid('paid', 'pending').required(),
            razorpay_order_id: Joi.string().required(),
            razorpay_payment_id: Joi.string().required(),
            razorpay_signature: Joi.string().required()
        })
        const validData = await UpdateSchema.validateAsync(req.body);

        let body = validData.razorpay_order_id + "|" + validData.razorpay_payment_id;

        var expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');
        var response = false;
        if (expectedSignature === req.body.razorpay_signature)
            response = true;
        if (response === true) {
            let result = await Order.findOneAndUpdate({ uuid: validData.order_uuid }, { payment_status: validData.payment_status })
            // Product Quantity Update
            for (let item = 0; item < result.details.length; item++) {

                let prod = await Product.findOne({ uuid: result.details[item].uuid });
                let qty = (prod.stock_quantity >= result.details[item].quantity) ? prod.stock_quantity - result.details[item].quantity : 0;
                await Product.findOneAndUpdate({ uuid: result.details[item].uuid }, { stock_quantity: qty })
            }
            return res.status(200).send({
                status: true,
                message: `${result.uuid}`
            });
        } else {
            return res.status(400).send({
                status: false,
                message: "Payment Not Verified"
            });
        }

    } catch (error) {
        return res.status(400).send(error.message);
    }
})

module.exports = router