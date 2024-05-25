const express = require('express')
const app = express()
const mongoose = require('mongoose')
const port = process.env.PORT || 3000
const productRouter = require('./routes/product')
const orderRouter = require('./routes/order')
const userRouter = require('./routes/user')
const morgan = require('morgan')
const bodyParser = require('body-parser')

mongoose.connect('mongodb://127.0.0.1:27017/rest-shop')
.then(()=>console.log('Connected to the database...'))
.catch(err=>console.log(err.message))

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended:false}))
app.use(express.json())

app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*')
    res.header('Access-Control-Allow-Headers', '*')
    if(req.method == 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT,POST,PATCH,DELETE,GET')
        return res.status(200).json({})
    }

    next()
})

app.use('/products', productRouter)
app.use('/orders', orderRouter)
app.use('/users', userRouter)
app.use(express.static('uploads'))
app.use('/uploads',express.static('uploads'))

app.use((req,res,next)=>{
    const err = new Error('Page not found ')
    res.status(404).json({
        error:err.message
    })
    next()
})

app.listen(port, ()=>console.log('Listening at port',port))