const express = require('express');
const mainRouter = express.Router();
const userRouter = require('./user');
const accountRouter = require('./account');
const invoiceRouter = require('./invoice');

mainRouter.use('/user',userRouter);
mainRouter.use('/account',accountRouter);
mainRouter.use('/invoice', invoiceRouter);


module.exports = mainRouter;