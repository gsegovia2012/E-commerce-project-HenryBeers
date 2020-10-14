const { Router } = require('express');
// import all routers;
const productRouter = require('./product.js');
const categoryRouter = require('./category.js')
// const userRouter = require ('./user') ----> ROMPE -- CONECTANDO A USER CON LA BD

const router = Router();

// load each router on a route
// i.e: router.use('/auth', authRouter);
// router.use('/auth', authRouter);
router.use('/products', productRouter);
router.use('/category', categoryRouter);
// router.use('/users', userRouter)  ----> ROMPE -- CONECTANDO A USER CON LA BD

module.exports = router;
