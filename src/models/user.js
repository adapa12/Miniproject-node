const { required } = require('joi');
const mongoose = require('mongoose');
const crypto = require('crypto');
const empSchema = new mongoose.Schema({
  uuid : {
    type : String,
    unique : true,
},
   name: {
    type: String,
    required: true,
  },
  mobile:{
    type: Number,
    required: true,
    unique : true
  },
  email:{
    type:String,
    required:true,
    unique : true,
  },
  password:{
    type:String,
    required:true,
  },
    group : {
        type : String,
        enum : ['admin','consumer'],
        default : 'admin'
    },
    is_deleted : {
      type : Boolean,
      default : false
    },
    is_verified : {
    type : Boolean,
    default : false
    },
  },
    {timestamps: true}
  )
  empSchema.pre("save", function(next){
    if(this.uuid) return next();
    this.uuid = 'ANV-'+crypto.pseudoRandomBytes(4).toString('hex').toUpperCase();
    next();
});
module.exports = mongoose.model('user',empSchema)