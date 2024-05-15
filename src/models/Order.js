'use strict'

const mongoose = require('mongoose')
const crypto = require("crypto");

const OrderSchema = new mongoose.Schema({
    uuid : {
        type : String,
        required : false,
        unique : true
    },
    checkout_uuid : {
        type : String,
        required : true
    },
    details : [],
    user_uuid : {
        type : String,
        required: false
    },
    total_amount : {
        type : Number,
        required : true
    },
    amount : {
        type : Number,
        required : true
    },
    transaction_uuid : {
        type : String,
        required : false
    },
    paymentgateway_id : {
        type : String,
        required : false,
        default : ""
    },
    payment_status : {
        type : String,
        enum : ['pending', 'paid']
    },
    delivery_address : {
        first_name : {
            type : String,
            required : true
        },
        last_name : {
            type : String,
            required : true
        },
        mobile : {
            type : String,
            required: true,
            unique : false
        },
        city : {
            type : String,
            required : true
        },
        state : {
            type : String,
            required : true
        },
        pincode : {
            type : Number,
            required :true
        },
        address : {
            type : String,
            required : true
        }
    },
    order_status : {
        type : String,
        enum : ['Pending','Accepted','Packing','Ready','Delivered','Cancelled'],
        default : 'Pending'
    }
},{
    timestamps : true,
    strict:  true
});

OrderSchema.pre('save', function(next){
    if(this.uuid) return next();

    this.uuid = "ORD-" + crypto.pseudoRandomBytes(4).toString('hex').toUpperCase();
    next();
});

module.exports = mongoose.model('order',OrderSchema);