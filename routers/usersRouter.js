const fs = require("fs");
const { validateUser,validatelogin } = require("../userHelpers");
const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const { error } = require("console");



router.post("/register", validateUser, async (req, res, next) => {
    try {
        const { username, age, password } = req.body;
        const data = await fs.promises.readFile('./user.json', { encoding: "utf8" }).then((data) => JSON.parse(data));
        const id = uuidv4();
        data.push({id,username, age, password });
        await fs.promises.writeFile('./user.json', JSON.stringify(data), { encoding: "utf8"});
        res.status(200).send({id,message: "sucess" });
    } 
    
    catch (error) {
        next({ status: 500, internalMessage: error.message });
    }
  })



router.patch("/:id", validateUser, async (req, res, next) => {
    try{
    const { username, password, age } = req.body;
    const users = await fs.promises.readFile('./user.json', { encoding: "utf8" }).then((data) => JSON.parse(data));
    const newusers = users.map((user)=>{
        if(user.id!==req.params.id) return user;
        return{
            username,password,age,id:req.params.id
        }
    })
    await fs.promises.writeFile('./user.json', JSON.stringify(newusers), { encoding: "utf8"});
    res.status(200).send({massage:"user edit"})
}
catch (error) {
    next({ status: 500, internalMessage: error.message });
}
});




router.get('/',async(req,res,next)=>{
    try{
    const age= Number(req.query.age)
    const users=await fs.promises.readFile('./user.json', { encoding: "utf8" }).then((data) => JSON.parse(data));
    const filteruser= users.filter(user=>user.age===age)
    res.send(filteruser)
    }catch{
        next({status:500,internalMessage:error.massage})
    }
})


router.post('/login',validatelogin,async(req,res,next)=>{
console.log("helllo ")
try{
    const { username, password } = req.body;
    const users = await fs.promises.readFile('./user.json', { encoding: "utf8" }).then((data) => JSON.parse(data));
    users.map((user)=>{
        if(user.username==username && user.password==password) {
          res.status(200).send({massage:"user login success"})
          return
        }
        })   
        res.status(403).send({massage:"username or password wrong!!!!!!!!"})
    }
   catch (error) {
    next({ status: 500, internalMessage: error.message });
}
})



router.delete("/", async (req, res, next) => {
    try{
    const users = await fs.promises.readFile('./user.json', { encoding: "utf8" }).then((data) => JSON.parse(data));
   const newusers = []
   users.map((user)=>{
        if(user.id !==req.query.id) 
         newusers.push(user);
    })
    await fs.promises.writeFile('./user.json', JSON.stringify(newusers), { encoding: "utf8"});
    res.status(200).send({massage:"user deleted"})
}
catch (error) {

    next({ status: 500, internalMessage: error.message });

}
});



router.get("/getuser", async (req, res, next) => {
    try{
    const users = await fs.promises.readFile('./user.json', { encoding: "utf8" }).then((data) => JSON.parse(data));
   users.map((user)=>{
        if(user.id ===req.query.id) {
         res.status(200).send(`the username is ${user.username} your age is ${user.age}`)
         return
        }
    })
  
    res.status(404).send({massage:"user not exist"})
}
catch (error) {

    next({ status: 500, internalMessage: error.message });

}
});




module.exports = router;
