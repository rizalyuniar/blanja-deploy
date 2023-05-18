const express = require('express')
const router = express.Router()
const productRouter = require('../routes/products')
const categoryRouter = require('../routes/categorys')
const customerRouter =require('../routes/customers')
const userRouter = require('../routes/users')


router.use('/products', productRouter);
router.use('/categorys', categoryRouter);
router.use('/customers', customerRouter);
router.use('/users', userRouter);

module.exports = router