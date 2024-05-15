'use strict'

const mongoose =  require('mongoose');
const crypto = require('crypto');


const CheckoutSchema = new mongoose.Schema({
    uuid :{
        type : String,
        required : false
    },
    user_uuid : {
        type : String,
        required: false
    },
    ip_address : {
        type : String,
        required: false
    },
    payment_status : {
        type : String,
        enum : ['pending','paid'],
        default : 'pending'
    },
    details : [],
    amount : {
        type : Number,
        required : true
    },
    total_amount : {
        type : Number,
        required : true
    }
},{
    timestamps : true,
    strict : true
});

CheckoutSchema.pre('save',function(next){
    if(this.uuid) return next();

    this.uuid = "CRTC-"+crypto.pseudoRandomBytes(4).toString('hex').toUpperCase();
    next();
});

module.exports = mongoose.model('checkout', CheckoutSchema);


