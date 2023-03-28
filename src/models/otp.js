
const mongoose = require('mongoose');

const OtpSchema = new mongoose.Schema({
    email:{
        type : String,
        required : true,
    },
    otp:{
        type : String,
        required : true, 
    },
    expiresAt :{ 
        type : Date,
        defalut:Date.now+600000
    },
    verified : {
        type : Boolean,
        required : true,
        default : false,
    },
},
    {timestamps : true}
)

module.exports = mongoose.model("otp", OtpSchema);