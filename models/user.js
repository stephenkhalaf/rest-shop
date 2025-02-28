const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
   email:{
    type:String,
    required:true,
    match:/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
   },
   password:{
    type:String,
    required:true
   }
})

module.exports = mongoose.model('User', userSchema)