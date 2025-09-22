const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const {MongoClient, ObjectId, ReturnDocument} = require('mongodb')
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

const getAllUsers = async (req,res)=>{
    try {
        await connectClient();
        const db = client.db("versionControl")
        const userCollection = db.collection('users')

        const users = await userCollection.find({}).toArray()
        res.send(users)

    } catch (error) {
        console.error(error)
        res.status(500).json({message:"Server Error"})
    }
}

const getUserProfile = async (req,res)=>{
    const currentId = req.params.id
    try {
        await connectClient();
        const db = client.db("versionControl")
        const userCollection = db.collection('users')

        const user = await userCollection.findOne({
            _id:new ObjectId(currentId)
        })

        res.send(user)
    } catch (error) {
        console.error(error)
        res.status(500).json({message:"Server Error"})
    }
}

const updateUserProfile =async (req,res)=>{
     const currentId = req.params.id
     const {email,password} = req.body

     try {
        await connectClient();
        const db = client.db("versionControl")
        const userCollection = db.collection('users')
        let updateField = {email}
        if(password){
            const salt = await bcrypt.genSalt(10)
            const newHashedPass = await bcrypt.hash(password,salt)
            updateField.password = newHashedPass;
        }

        const result = await userCollection.findOneAndUpdate({
            _id:new ObjectId(currentId),
        },
        {$set:updateField},
        {returnDocument:"after"}
    
    )
    
    res.send(result.value)


     } catch (error) {
        console.error(error)
        res.status(500).json({message:"Server Error"})
     }
}

const deleteUserProfile =async (req,res)=>{
    const currentId = req.params.id
    
    try {
        await connectClient();
        const db = client.db("versionControl")
        const userCollection = db.collection('users')

        const result = await userCollection.deleteOne({
            _id:new ObjectId(currentId)
        })

        if(result.deleteCount == 0){
            return res.status(404).json({message:"User not Found"})
        }

        res.json({message:"User Deleted"})

    } catch (error) {
        console.error(error)
        res.status(500).json({message:"Server Error"})
    }
}

module.exports = {
    getAllUsers,
    login,
    signup,
    getUserProfile,
    updateUserProfile,
    deleteUserProfile,
}