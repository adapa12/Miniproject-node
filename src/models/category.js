const mongoose = require('mongoose');
const crypto = require("crypto")

const CategorySchema = new mongoose.Schema({
    uuid : {
        type : String,
        unique : true,
    },
    name : {
        type : String,
        required : true
    },
    image : {
        type :  String,
        required : false,
        default : ""
    },
    is_deleted : {
        type : Boolean,
        required : false,
        default : false
    },
},
  { timestamps : true}
)
CategorySchema.pre("save", function(next){
    if(this.uuid) return next();
    this.uuid = 'ADA-'+crypto.pseudoRandomBytes(4).toString('hex').toUpperCase();
    next();
});

module.exports = mongoose.model("Category", CategorySchema);