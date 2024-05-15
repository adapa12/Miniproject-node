const { string } = require('joi');
const mongoose = require('mongoose');
const crypto = require("crypto")

const ProductSchema = new mongoose.Schema({

    uuid : {
        type : String,
        unique : true,
    },
    categoryid : {
        type : String,
        required : false,
    },
    name :{
        type : String,
        required : true,
    },
    price :{
        type : Number,
        required :true 
    },
    discount : {
        type : Number,
        required : true
    },
    discription : {
        type : String,
        required : true
    },
    quantity : {
      type : Number,
      required : true
    },
    image:{
        type:String,
        required :false
    },
    is_deleted : {
        type : Boolean,
        required : false,
        default : false
    },
    is_active : {
        type : Boolean,
        required : false,
        default : true
    },
}, {
    timestamps : true }

)

ProductSchema.pre("save", function(next){
    if(this.uuid) return next();
    this.uuid = 'PRO-'+crypto.pseudoRandomBytes(4).toString('hex').toUpperCase();
    next();
});

module.exports = mongoose.model("product", ProductSchema);