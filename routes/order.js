const express = require('express')
const router = express.Router()
const Order = require('../models/order')
const Product = require('../models/product')
const checkAuth = require('../middleware/check-auth')

router.get('/',checkAuth,async (req,res)=>{
    try{
        const orders = await Order.find({}).populate('productId')
        res.status(200).json(orders)
    }catch(err){
        res.status(404).json({
            error:err.message
        })
    }
}) 

router.post('/', checkAuth,async (req,res)=>{
    try{
        const product = await Product.findById(req.body.productId)
        if(product){
            const order = new Order({
                quantity:req.body.quantity,
                productId:req.body.productId
            })
            await order.save()
            res.status(200).json(order)  
        }
    }catch(err){
        res.status(500).json({
            message: 'An error occur while posting order'
        })
    }
})

router.get('/:id',checkAuth,async(req,res)=>{
    const id = req.params.id
    try{
        const order = await Order.findById({_id:id})
        res.status(200).json(order)
    }catch(err){
        res.status(404).json({
            error:err.message
        })
    }
})

router.delete('/:id',checkAuth,async(req,res)=>{
    const id = req.params.id
    try{
       const order =  await Order.findByIdAndDelete({_id:id})
       if(order){
        res.status(200).json({
            message:'Order is deleted'
        })
       }else{
        res.status(200).json({
            message:'Order not found'
        })
       }
    }catch(err){
        res.status(404).json({
            error:err.message
        })
    }
})


module.exports = router