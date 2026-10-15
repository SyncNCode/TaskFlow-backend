const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')
const router = require('./routes/userRoutes')
const taskRouter = require('./routes/taskRoutes')

dotenv.config()

const app = express()
app.use(express.json())
app.use(cors())

//ports 
app.use('/api/auth',router)
app.use("/api/tasks", taskRouter);

const PORT = process.env.PORT || 5000

app.get('/',(req,res)=>{
    res.send('server is running')
})

mongoose.connect("mongodb://localhost:27017/mock")
.then(()=>{
    console.log('mongodb connected')
})
.catch((err)=>{
    console.log(err)
})

app.listen(PORT,()=>{
    console.log(`app is running on ${PORT}`)
})