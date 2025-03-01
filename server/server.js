const exp=require("express")
const app=exp()
require('dotenv').config(); //process.env
const mongoose=require("mongoose");
const userApp = require("./APIs/userApi");
const adminApp = require("./APIs/adminApi");
const authorApp = require("./APIs/authorApi");
const cors=require('cors')
app.use(cors())

const port=process.env.PORT || 4000;

mongoose.connect(process.env.DBURL)
    .then(()=>{
        app.listen(port,()=>console.log(`server listening on port ${port}...`))
    console.log("DB connection success")
    })
    .catch(err=>console.log("Error in DB connection",err))

//body parser middleware
app.use(exp.json())
//connect API routes
app.use('/user-api',userApp) 
app.use('/admin-api',adminApp) 
app.use('/author-api',authorApp)  

                
//error handler
app.use((err,req,res,next)=>{
    console.log("err object in express handler :",err)

    res.send({message:err.message})
})