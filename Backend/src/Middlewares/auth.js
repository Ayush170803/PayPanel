const User = require('../models/user');
const jwt = require("jsonwebtoken");
const JWT_SECRET = require('../Config/config');
const cookieParser = require("cookie-parser");

const userauth = async (req,res,next) =>
{
    try
    {
      const {token} = req.cookies;
        if(!token)
        {
            return res.status(401).send("Please Login");
        }
            const decodedmsg = jwt.verify(token,JWT_SECRET);
            const id=decodedmsg._id;
            const userdetails = await User.findById(id);
            if(!userdetails)
            {
                throw new Error("user does not exist");
            }
            req.userdetails=userdetails;
            next();
    }
    catch(er)
    {
        res.status(500).send("Internal Server Error");
    }
}
module.exports = {userauth};