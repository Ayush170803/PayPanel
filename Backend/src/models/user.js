const mongoose = require('mongoose');
const jwt = require("jsonwebtoken"); 
const bcrypt = require("bcrypt");
const JWT_SECRET = require('../Config/config');
const {Schema} = mongoose;
const validator = require("validator");

const userSchema = new Schema({
    firstName:{type:String, required:true, trim:true},
    lastName:{type:String,required:true, trim:true},
    emailId:{type:String, required:true, unique:true, lowercase:true, trim:true},
    password:{type:String, required:true, minLength: 8},
    photoUrl:{type: String, default:"https://th.bing.com/th/id/OIP.Z306v3XdxhOaxBFGfHku7wHaHw?rs=1&pid=ImgDetMain",
    validate(value)
    {
      if(!validator.isURL(value))
      {
        throw new Error("Wrong Image Link");
      }
    }
  },
},
{ timestamps: true })


userSchema.methods.getjwt = async function ()
{
    const user=this;
    const token = await jwt.sign({_id:user._id},JWT_SECRET,{ expiresIn: '1h' });
    return token; 
}

const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;