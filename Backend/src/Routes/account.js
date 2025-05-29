const express = require('express');
const accountRouter = express.Router();
const {userauth} = require('../Middlewares/auth');
const Account = require("../models/account");
const User = require("../models/user");
const {mongoose } = require('mongoose');

accountRouter.get('/balance',userauth, async (req,res)=>
{
    try
    {
    const user = req.userdetails;
    const userId = user._id;
    const account = await Account.findOne({userId:userId});

    res.json({
        balance: account.balance
    })
    }
    catch(er)
    {
        res.status(400).send("Can't Get the Balance");
    }
})

accountRouter.post('/transfer',userauth, async (req,res)=>
{
    try
    {
        const session = await mongoose.startSession();
        session.startTransaction();

        const {toUserId,amount} = req.body;
        const fromUser = req.userdetails;
        const fromUserAccount = await Account.findOne({userId:fromUser._id}).session(session)
        let fromUserBalance = fromUserAccount.balance;
        
        if(fromUserBalance<amount)
        {
            await session.abortTransaction();
            return res.json({
                message:"Insufficient Balance"
            })
        }

        const toUserAccount = await Account.findOne({userId:toUserId}).session(session);
        
        if(!toUserAccount)
        {
            await session.abortTransaction();
             return res.status(400).json({
            message: "Invalid account"
        })
        }

        await Account.updateOne({userId:fromUser._id},{$inc:{balance:-amount}}).session(session);
        await Account.updateOne({userId:toUserId},{$inc:{balance:amount}}).session(session);

        await session.commitTransaction(); //commit the transaction finally at last

        res.json({"success": true,
        message: "Transfer successful"
         })
    }
    catch(er)
    {
         res.status(400).send("error:"+ er.message);
    }
})
module.exports=accountRouter;