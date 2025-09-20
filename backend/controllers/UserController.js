const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const {MongoClient} = require('mongodb')
const dotenv = require('dotenv')

dotenv.config()
let client
const url = process.env.MONGO_URL

async function connectClient() {
    if(!client){
        client = new MongoClient(url,{
            useNewUrlParser:true,
            UseUnifiedTopology:true,
        })
        await client.connect();
    }
}

const signup = async (req,res)=>{
    const {username,password,email}  = req.body

    try {
        await connectClient()
        const db = client.db("versionControl")
        const userCollection = db.collection('users')

        const user = await userCollection.findOne({username})
        if(user){
            return res.status(400).json({message:"User Already Exist"})
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPass = await bcrypt.hash(password,salt)
        const newUser = {
            username,
            password:hashedPass,
            email,
            repositories:[],
            followedUser : [],
            starRepos : [],
        }

        const result = await userCollection.insertOne(newUser)
        const token  = jwt.sign({id:result.insertId},process.env.JWT_SECRET_KEY,{expiresIn:"1h"})
        res.json({token})
    } catch (error) {
        console.error(error)
        res.status(500).json({message:"Server Error"})
        
    }
}

const login = async (req,res)=>{
    const {email,password} = req.body

    try {
        await connectClient();
        const db = client.db("versionControl")
        const userCollection = db.collection('users')

         const user = await userCollection.findOne({email})
        if(!user){
            return res.status(400).json({message:"Invalid Credentials"})
        }

        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(400).json({message:"Invalid Credentials"})
        }

         const token  = jwt.sign({id:user._id},process.env.JWT_SECRET_KEY,{expiresIn:"1h"})
         res.json({userId:user._id,token})
        
    } catch (error) {
        console.error(error)
        res.status(500).json({message:"Server Error"})
    }
}

const getAllUsers = (req,res)=>{
    res.send('All Users Fetched')
}

const getUserProfile = (req,res)=>{
    res.send('Enterd Repo')
}

const updateUserProfile = (req,res)=>{
    res.send('Update Success')
}

const deleteUserProfile = (req,res)=>{
    res.send('Deleted the profile')
}

module.exports = {
    getAllUsers,
    login,
    signup,
    getUserProfile,
    updateUserProfile,
    deleteUserProfile,
}