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
  profile_pic : {
    type : String,
    required : false
  },
    group : {
        type : String,
        enum : ['admin','consumer'],
        default : 'consumer'
    },
    is_active : {
      type : Boolean,
      default : false
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
    this.uuid = 'US-'+crypto.pseudoRandomBytes(4).toString('hex').toUpperCase();
    next();
});
module.exports = mongoose.model('user',empSchema)