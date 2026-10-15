const jwt = require('jsonwebtoken')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const userSignup = async (req,res)=>{
    try {
        const {name,email,password} = req.body
        if(!name||!email||!password){
            return res.status(400).json({
                message : 'fill all the required fields'
            })
        }

        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(401).json({
                message : "Email already exists"
            })
        }

        const passwordHash = await bcrypt.hash(password,10)

        const user = await User.create({
            name,
            email,
            password : passwordHash
        })

        res.status(200).json({
            message : "user created successfully",
            user :{
                userId : user._id,
                name : user.name,
                email : user.email
            }
        })


    } catch (error) {
        res.status(500).json({
            message : error.message
        })
    }
}

const userLogin = async (req,res)=>{
    try {
        const {email,password} = req.body
        if(!email||!password){
            return res.status(404).json({
                message : "fill all the required fields"
            })
        }

        const existingUser = await User.findOne({email})
        if(!existingUser){
            return res.status(401).json({
                message : "email does'nt exist"
            })
        }

        const isMatch = await bcrypt.compare(password,existingUser.password)
        if(!isMatch){
            return res.status(404).json({
                message : "incorrect password"
            })
        }

        const token = jwt.sign(
            {userId : existingUser._id},
            process.env.JWT_SECRET,
            {expiresIn : "7d"}
        )

        res.status(200).json({
            message : "login successful",
            token,
            user :{
                userId:existingUser._id,
                name : existingUser.name,
                email : existingUser.email
            }
        })
    } catch (error) {
        res.status(500).json({
            message : error.message
        })
    }
}

module.exports = {userSignup,userLogin}