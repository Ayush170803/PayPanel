const mongoose = require('mongoose');
const {Schema} = mongoose;

const accountSchema = new Schema({
    userId:{type: Schema.Types.ObjectId, required:true, ref:"User"}, // reference to the user model
    balance:{type:Number, required:true}
})

module.exports = mongoose.model("Account",accountSchema);