const { required } = require('joi');
const mongoose = require('mongoose');
const crypto = require('crypto');
const CartSchema = new mongoose.Schema({
    uuid : {
        type : String,
        required : false
    },
    item_uuid : {
        type : String,
        required : true
    },
    quantity : {
        type : Number,
        required : true
    },
    user_uuid : {
        type : String,
        required : false,
    },
    ip_address : {
        type : String,
        required : false
    },
    is_active : {
        type : Boolean,
        default : true
    },
    is_deleted : {
        type : Boolean,
        default : false
    }
},{
    timestamps : true,
    strict : true
});

CartSchema.pre('save', function(next){
    if(this.uuid) return next();

    this.uuid = "CRT-"+crypto.pseudoRandomBytes(4).toString('hex').toUpperCase();
    next()
});

module.exports = mongoose.model('cart', CartSchema);