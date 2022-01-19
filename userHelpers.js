const fs = require('fs')
// some
// find
const validateUser = async(req,res,next) =>{
    try {
        const {username , age,password} = req.body;
        if(!username && !password)
            return next({status:422,message:"username and password are require"})
        
        if(!username)
            return next({status:422,message:"username is require"})
        
        if(!password)
            return next({status:422,message:"password is require"})
        
        const data = await fs.promises.readFile('./user.json',{encoding:'utf8'})
        const users = JSON.parse(data)
        const isUsernameExists = users.some(user=>user.username===username)
        if(isUsernameExists && req.method=="POST" ) return next({status:422, message:"username is used"})
        next()
    } catch (error) {
        next({status:500, internalMessage:error.message})
    }
}



const validatelogin = async(req,res,next) =>{
    try {
        const {username , age,password} = req.body;
        if(!username && !password)
            return next({status:422,message:"username and password are require"})
        
        if(!username)
            return next({status:422,message:"username is require"})
        
        if(!password)
            return next({status:422,message:"password is require"})
        next()
    } catch (error) {
        next({status:500, internalMessage:error.message})
    }
}

module.exports = {
    validateUser,
    validatelogin
}