 const mongoose = require('mongoose');
 const {Schema} = mongoose;

 const otpSchema = new Schema({
    emailId:{type:String,required:true},
    otp:{type:String,required:true},
    expiresAt:{type:Date,required:true},
    verified:{type:Boolean,default:false}
 })

 module.exports = mongoose.model("Otp",otpSchema);