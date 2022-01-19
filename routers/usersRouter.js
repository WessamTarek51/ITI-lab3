const fs = require("fs");
const { validateUser,validatelogin} = require("../userHelpers");
const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const { error } = require("console");
const jwt = require('jsonwebtoken')
const serverConfig = require('../serverConfig');
const { auth } = require("../middlewares/auth");
const User= require('../models/User');
const { query } = require("express");
require('../mongoConnect')



router.post("/register",async (req, res, next) => {
    try {
       const { username, age, password } = req.body;
       const user = new User({username ,age ,password})
        await user.save();
        res.status(200).send({message: "sucess"}); 
    }catch(error){   
        next({ status: 422, message: error.message}); 
    }
})


router.post('/login',async(req,res,next)=>{
    try{
        
        const {username, password} = req.body
        const user = await User.findOne({ username })
        if(!user) return next({status:401, message:"username or passord is incorrect"})
        if(user.password !== password) next({status:401, message:"username or passord is incorrect"})
        
        const payload = {id:user.id}
        const token=jwt.sign(payload,serverConfig.secret,{expiresIn:"1h"})
        return res.status(200).send({message:"Logged in Successfully", token}) 
        }
       catch (error) {
        next({ status: 500, internalMessage: error.message });
    }
    })


 router.patch("/:userId",auth, async (req, res, next) => {

 if(req.user.id !== req.params.userId) 
 next({status:403, message:"Authorization error"})
  try {
    const {password, age} = req.body
    req.user.password = password
    req.user.age = age
    await req.user.save()
    res.send("edited success")
  } catch (error) {
    next({ status: 500, internalMessage: error.message });
}
})  


router.get('/getusers/',auth,async(req,res,next)=>{
    if(req.user.id !== req.query.id) 
    next({status:403, message:"Authorization error"})
    try{
    const filter= req.query.age?{age:req.query.age}:{}
    const users = await User.find(filter,{password:0})
    res.send(users)
    }catch{
        next({status:500,internalMessage:error.massage})
    }
})





// router.post("/register", validateUser, async (req, res, next) => {
//     try {
//         const { username, age, password } = req.body;
//         const data = await fs.promises.readFile('./user.json', { encoding: "utf8" }).then((data) => JSON.parse(data));
//         const id = uuidv4();
//         data.push({id,username, age, password });
//         await fs.promises.writeFile('./user.json', JSON.stringify(data), { encoding: "utf8"});
//         res.status(200).send({id,message: "sucess" });
//     } 
    
//     catch (error) {
//         next({ status: 500, internalMessage: error.message });
//     }
//   })






// router.patch("/:id",validateUser, async (req, res, next) => {
//     try{
//     const { username, password, age } = req.body;
//     const users = await fs.promises.readFile('./user.json', { encoding: "utf8" }).then((data) => JSON.parse(data));
//     const newusers = users.map((user)=>{
//         if(user.id!==req.params.id) return user;
//         return{
//             username,password,age,id:req.params.id
//         }
//     })
//     await fs.promises.writeFile('./user.json', JSON.stringify(newusers), { encoding: "utf8"});
//     res.status(200).send({massage:"user edit"})
// }
// catch (error) {
//     next({ status: 500, internalMessage: error.message });
// }
// });




// router.get('/',async(req,res,next)=>{
//     try{
//     const age= Number(req.query.age)
//     const users=await fs.promises.readFile('./user.json', { encoding: "utf8" }).then((data) => JSON.parse(data));
//     const filteruser= users.filter(user=>user.age===age)
//     res.send(filteruser)
//     }catch{
//         next({status:500,internalMessage:error.massage})
//     }
// })


// router.delete("/", async (req, res, next) => {
//     try{
//     const users = await fs.promises.readFile('./user.json', { encoding: "utf8" }).then((data) => JSON.parse(data));
//    const newusers = []
//    users.map((user)=>{
//         if(user.id !==req.query.id) 
//          newusers.push(user);
//     })
//     await fs.promises.writeFile('./user.json', JSON.stringify(newusers), { encoding: "utf8"});
//     res.status(200).send({massage:"user deleted"})
// }catch (error) {

//     next({ status: 500, internalMessage: error.message });

// }
// });



// router.get("/getuser", async (req, res, next) => {
//     try{
//     const users = await fs.promises.readFile('./user.json', { encoding: "utf8" }).then((data) => JSON.parse(data));
//    users.map((user)=>{
//         if(user.id ===req.query.id) {
//          res.status(200).send(`the username is ${user.username} your age is ${user.age}`)
//          return
//         }
//     })
  
//     res.status(404).send({massage:"user not exist"})
// }
// catch (error) {

//     next({ status: 500, internalMessage: error.message });

// }
// });




// router.get('/deleteuser/',auth,async(req,res,next)=>{
//     if(req.user.id !== req.query.id) 
//     next({status:403, message:"Authorization error"})
//     try{
//     const k= req.query.id?{id:req.query.id}:{}
//     const users = await User.remove(k)
//     res.send(users)
//     }catch{
//         next({status:500,internalMessage:error.massage})
//     }
// })




module.exports = router;
