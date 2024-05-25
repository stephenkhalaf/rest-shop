const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt  = require('jsonwebtoken')

router.get('/', async (req,res)=>{
    const users = await User.find({})
    try{
        res.status(200).json(users) 
    }catch(err){
        res.status(404).json({
            error:err
        })
    }
})


router.post('/signup', async(req,res)=>{
    const user = await User.find({email:req.body.email})
    if(user.length){
        res.status(409).json({
            message:'This email already exist'
        })
    }else if(req.body.password.length < 6){
        res.status(409).json({
            message:'The password length must be greater than 6'
        })
    }else{
        bcrypt.hash(req.body.password,10,async (err,hash)=>{
            if(err){
                return res.status(500).json({
                    error:err
                })
            }else{
                const user = new User({
                    email:req.body.email,
                    password:hash
                })
                try{
                     await user.save()
                    res.status(200).json({
                        message:'User Created!'
                    })
                }catch(err){
                    res.status(404).json({
                        error:err
                    })
                }
            }
        })
    }
    
})

router.post('/login', async (req,res)=>{
    const user = await User.find({email:req.body.email})
    try{
        if(user.length == 0){
            res.status(401).json({
                message:'Auth Failed!'
            })
        }else{
            bcrypt.compare(req.body.password,user[0].password,(err,result)=>{
                if(!result){
                    res.status(401).json({
                        message:'Auth Failed!'
                    })
                }
                if(result){
                    const token = jwt.sign({
                        email:user[0].email,
                        id:user[0]._id
                    }, 'secretkey',{
                        expiresIn: '1h'
                    })
                    res.status(200).json({
                        message:'Auth Successful!',
                        token:token
                    })
                }
            })
        }
    }catch(err){
        res.status(500).json({
            error:err
        })
    }
})

router.delete('/:id', async (req,res)=>{
    try{
        await User.findByIdAndDelete({_id:req.params.id})
        res.redirect('/users') 
    }catch(err){
        res.status(500).json({
            error:err
        })
    }
})
module.exports = router