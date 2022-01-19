const express = require('express')
const fs = require('fs')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const {logRequest} = require('./generalHelpers')
const userRouter = require('./routers/usersRouter')

app.use(bodyParser.json())

app.use('/users',userRouter)
app.use(logRequest)
app.use((err,req,res,next)=>{
  if(err.status>=500){
    console.log(err.internalMessage)
    return res.status(500).send({error:"server error"})
  }
  res.status(err.status).send(err.message)
  })

  app.listen(port,() => {
    console.log(`Example app listening at http://localhost:${port}`)
  })
  

