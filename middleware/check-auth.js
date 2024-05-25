const jwt  = require('jsonwebtoken')

module.exports = (req,res,next)=>{
    try{
        const token = req.headers.authorization.split(' ')[1]
        console.log(token)
        const decoded = jwt.verify(token,'secretkey')
        req.userData = decoded
        next()
    }catch(err){
        res.status(401).json({
            message: 'Please, You must be logged in'
        })
    }
}

/* To Send The Token As Header, add the following to the postman header*/
// Authorization : Bearer token