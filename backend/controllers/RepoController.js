const mongoose = require('mongoose')
const Repo = require('../models/repoModel.js')
const User = require('../models/userModel.js')
const Issue = require('../models/issueModel.js')

const createRepo = async (req,res)=>{
    const {name,owner,issues,visibility,description,content} = req.body

    try {
        if(!name){
           return res.status(404).json({error:"Repo Name is required"})
        }
        if(!mongoose.Types.ObjectId.isValid(owner)){
             return res.status(404).json({error:"Owner Name is required"})
        }

        const newRepo = new Repo({
            name,
            owner,
            issues,
            visibility,
            description,
            content
        })

        const result = await newRepo.save()

     
        res.status(200).json({message:"Repo Created",repositoryId:result._id})
    }catch (error) {
        console.error(error)
        res.status(500).json({message:"Server Error"})
     }


}

const getAllRepo = async (req,res)=>{
    try {
        const reposiotries = await Repo.find({})
        res.send(reposiotries)
    } catch (error) {
        console.error(error)
        res.status(500).json({message:"Server Error"})
     }

}

const fetchRepoById = async (req,res)=>{
    const {id} = req.params
    try {
        const repo = await Repo.find({_id:id}).populate("owner").populate('issues')
        res.send(repo)
    } catch (error) {
        console.error(error)
        res.status(500).json({message:"Server Error"})
     }
}

const fetchRepoByName = async (req,res)=>{
     const {name} = req.params
    try {
        const repo = await Repo.find({name:name}).populate("owner").populate('issues')
        res.send(repo)
    } catch (error) {
        console.error(error)
        res.status(500).json({message:"Server Error"})
     }
}

const fetchRepoForCurrentUser = (req,res)=>{
    res.send('Repo of current User')
}

const updateRepoById = (req,res)=>{
    res.send('Repo Updated')
}

const deleteRepoById = (req,res)=>{
    res.send('Repo Deleted')
}

const toggleVisibility = (req,res)=>{
    res.send('Repo Visibility Changed')
}

module.exports = {
    createRepo,
    getAllRepo,
    fetchRepoById,
    fetchRepoByName,
    fetchRepoForCurrentUser,
    updateRepoById,
    deleteRepoById,
    toggleVisibility
}   