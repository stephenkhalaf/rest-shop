const express = require('express')
const router = express.Router()
const Product = require('../models/product')
const multer = require("multer")
const checkAuth = require('../middleware/check-auth')

function fileFilter(req, file, cb) {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg" || file.mimetype === "image/png" || file.mimetype === "image/jfif") {
        cb(null, true)
    } else {
        cb(null, false)
    }
    cb(new Error('I don\'t have a clue!'))
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)      
    }
})

const upload = multer({
    storage: storage, limits: {
        fieldSize: 1024 * 1024 * 5,
        fileFilter: fileFilter
    }
})
router.get('/', async (req,res)=>{
    try{
        const products = await Product.find({})
        if(products.length){
            res.status(200).json(products)
        }else{
            res.status(404).json({
                message: 'Product list is empty'
            })
        }
    }catch(err){
        res.status(404).json({
            error:err.message
        })
    }
})

router.post('/',checkAuth,upload.single('productImage'),async (req,res)=>{
    const product = new Product({
        name:req.body.name,
        price:req.body.price,
        productImage: req.file.path
    })
    try{
        await product.save()
        res.status(200).json({
            message: 'product successfully saved'
        })
    }catch(err){
        res.status(500).json({
            error:err.message
        })
    }
  
})

router.get('/:id', async (req,res)=>{
    const id = req.params.id
    try{
        const product = await Product.findById(id)
         res.status(200).json(product)
    }catch(err){
        res.status(404).json({
            error: 'An error occurred'
        })
    }
})

router.delete('/:id', checkAuth,async(req,res)=>{
    const id = req.params.id
    try{
         await Product.findByIdAndDelete({_id:id})
        
         res.redirect('/products')
    }catch(err){
        res.status(500).json({
            error: err.message
        })
    }
})

router.patch('/:id',checkAuth, async(req,res)=>{
    const id = req.params.id
    try{
        const product = Product.findById({_id:id})
        await Product.findByIdAndUpdate({_id:id},{
            name:req.body.name ||product.name,
            price:req.body.price || product.price 
        })
        res.status(200).json({
            message: `Updated product of id ${id}`
         })
    }catch(err){
        res.status(500).json({
            error: err.message
        })
    }
})

module.exports = router