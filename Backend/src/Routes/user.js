const express = require("express");
const userRouter = express.Router();
const User = require('../models/user');
const validateSignupData = require('../utils/validation');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { userauth } = require('../Middlewares/auth');
const validator = require("validator");
const Account = require('../models/account');
const Otp = require('../models/otp');
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
})

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

userRouter.post('/signup', async (req,res)=>
{
    try
    {
        const {firstName,lastName,emailId,password} = req.body;
        validateSignupData(req);
        const passwordhash = await bcrypt.hash(password, saltRounds);
        const existinguser = await User.findOne({emailId:emailId});
        if(existinguser)
        {
            return res.status(409).json({message : "User already exists" });
        }
        const user = new User({firstName,lastName,emailId,password:passwordhash});
        const saveduser = await user.save();

        
      const token= await saveduser.getjwt();
      
      res.cookie("token",token,{expires: new Date(Date.now()+8*3600000)});

        const userId = user._id;
        const account = new Account({userId,
            balance:1+Math.random()*100000
        })
        await account.save();

        res.json(
        {
          message:"data successfully saved on db",
          data:saveduser
        });
    }
    catch(er)
    {
   res.status(400).json({ message: er.message });
    }
})

userRouter.post('/signin',async(req,res)=>
{
    try
    { 
    const {emailId,password} = req.body;
    // check whether the email id is present or not otherwise user is missing
    const user = await User.findOne({emailId:emailId});
          if(!user)
          {
            res.status(400).send("Invalid Credentials");
          }
        const validpwd = await bcrypt.compare(password,user.password);
        // make a token using jwt and assign to it cookie
        if(validpwd)
        {
             const token= await user.getjwt();
              res.cookie("token",token,{expires: new Date(Date.now()+8*3600000)});
              res.json({
                 message:"login Successful",
                 user
               })
        }
    else
        {
          res.status(400).send("wrong password");
        }
      }
      catch(er)
      {
         res.status(400).json({ message: er.message });
      }
})

userRouter.post('/signout', userauth, async (req, res) => {
    try
    {
        res.cookie("token","",{httpOnly: true, secure: true, sameSite: "strict", expires: new Date(Date.now())});
        res.status(200).json({ message: "User logged out successfully."});
    }
    catch(err)
    {
        res.status(500).json({ error: "Logout failed. Please try again."});
    }
});

userRouter.patch('/update',userauth, async (req,res)=>
{
    try
    {
        const allowedupdates = ["firstName","lastName","password","photoUrl"];

        const updates = Object.keys(req.body);
        if (updates.length === 0) {
            return res.status(400).send({ message: "No update parameters provided" });
        }

        const isupdateallowed = Object.keys(req.body).every((field)=>allowedupdates.includes(field));
        if(!isupdateallowed)
        {
            return res.status(400).send({message : "Edit not allowed with given parameters"});
        }
        const loggedinuser = req.userdetails;

        Object.keys(req.body).forEach(key=>{
        loggedinuser[key] = req.body[key];
        });

        if(req.body.password)
        {
            const ispasswordvalid = validator.isStrongPassword(req.body.password);
            if(!ispasswordvalid)
            {
                return res.json({message:"Invalid Password Format"});
            }
            const passwordhash = await bcrypt.hash(req.body.password, saltRounds);
            loggedinuser.password=passwordhash;
        }

        await loggedinuser.save();
        res.json({message:"user updated successfully",data:loggedinuser});
    }
    catch(er)
    {
    res.status(400).send("error:"+ er.message);
    }
})

userRouter.get('/find', userauth, async (req,res)=>
{
    try
    {
        const filter = req.query.filter || "";

        //^ filter matches with the firstname and the lastname and this syntax matches with the sustring

        const users = await User.find({
            _id: { $ne: req.userdetails._id },
            $or:[
                    {firstName:{'$regex':filter, '$options' : 'i'}},
                    {lastName:{'$regex':filter, '$options' : 'i'}}  
                ]
             })

        res.json({
            message:"",
            user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id,
            photoUrl:user.photoUrl,
            emailId:user.emailId
        }))
        })

    }
    catch(er)
    {
        res.status(400).send("error: " + er.message);
    }
})

userRouter.post('/send-otp',async (req,res)=>
{
    try
    {
        const {emailId} = req.body;
        if(!emailId){
            return res.status(400).json({error:"Email is required"});
        }
        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 5*60*1000);
        
        await Otp.deleteMany({emailId});
        await Otp.create({emailId,otp,expiresAt});

        const mailing = {
            from:process.env.EMAIL_USER,
            to:emailId,
            subject:"PayPanel OTP - Password Reset",
            html: `
                <p>Hi ${emailId},</p>
                <p>Sorry to hear you're having trouble logging into PayPanel.</p>
                <p>We got a message that you forgot your password. If this was you, you can get right back into your account or reset your password now.</p>

                <h2>Your OTP is: <span style="color: #ff3366;">${otp}</span></h2>
                <p><strong>Note:</strong> It will expire in 5 minutes.</p>

                <br/>
                <img src="https://upload.wikimedia.org/wikipedia/commons/8/89/PayBoard.png" alt="PayPanel" width="150" height="150"/>
            `
        }
        await transporter.sendMail(mailing);
        res.json({message:"Otp has been successfully sent to mail"});
    }
    catch(er)
    {
         res.status(400).json({ message: er.message });
    }
})

userRouter.post('/verify-otp', async (req,res)=>
{
    try
    {
    const {emailId,otp} = req.body;
    const data = await Otp.findOne({emailId:emailId});

    if(!data) return res.status(400).json({message:"otp not found"});
    if(data.expiresAt<Date.now()) return res.status(400).json({message:"Otp expires Try Again"});
    if(data.otp != otp) return res.status(400).json({message:"Invalid Otp"});
    data.verified=true;
    await data.save();
    res.json({message:"Successfully Verified OTP"});
    }
    catch(er)
    {
        console.log(er.message);
    }
})

userRouter.post('/update-password', async (req,res)=>
{
    try{
        const {emailId,newPassword} = req.body;
        if (!emailId||!newPassword) return res.status(400).json({ error: "Email and new password required" });
        
        const otpRecord=await Otp.findOne({emailId,verified:true});
        if(!otpRecord) return res.status(403).json({error:"OTP not verified or expired"});

        const user=await User.findOne({emailId});
        if(!user) return res.status(404).json({error:"User not found"});
         
        const ispasswordvalid = validator.isStrongPassword(newPassword);
            if(!ispasswordvalid)
            {
                return res.json({message:"Invalid Password Format"});
            }
            const passwordhash = await bcrypt.hash(newPassword,saltRounds);
            user.password = passwordhash;
            await user.save();
            await Otp.deleteMany({emailId});
            res.json({message:"Password updated successfully"});
    }
    catch{
        res.json({message:"Can't able to update the password"});
    }
})

module.exports = userRouter;