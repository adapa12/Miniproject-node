const mongoose = require('mongoose');
const crypto = require("crypto");

const slotSchema = new mongoose.Schema({
    slot_type :{
        type : String,
        required : true
    },
    status : {
        type : boolean,
        required : true
    },
      date : {
        type : Date,
        require : true
    },
    emp_uuid :{
        type : String,
        required : true
    },
    start_time :{
        type : Date,
        required  : true
    },
    end_time :{
        type : Date,
        required : true
    },
    is_active :{
        type : boolean,
        required : true,
        default : true,
    },
    is_deleted : {
        type : boolean,
        required : true,
        default : false
    },
   },
    {
        timestamps : true,
    });

    module.exports = mongoose.model('slot',slotSchema)