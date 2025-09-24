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

const fetchRepoForCurrentUser = async (req,res)=>{
    const userId = req.user

    try {
        const repos = await Repo.findById(id)

        if(!repos || repos.length == 0){
            return res.status(404).json({message:"Repo Not Found"})
        }

        res.json({message:"Repos Found",repos})
    } catch (error) {
        console.error(error)
        res.status(500).json({message:"Server Error"})
     }
}

const updateRepoById = async(req,res)=>{
    const {id} = req.params
    const {content,description} = req.body

    try {
        const repo = await Repo.findById(id)
         if(!repos || repos.length == 0){
            return res.status(404).json({message:"Repo Not Found"})
        }

        repo.content.push = content
        repo.description = description
        const updatedRepo = await repo.save()
        
        res.json({message:"Repo Updated",reposiotries:updatedRepo})

    } catch (error) {
        console.error(error)
        res.status(500).json({message:"Server Error"})
     }
}

const deleteRepoById = async (req,res)=>{
    const {id} = req.params;

    try {
        const repo = await Repo.findByIdAndDelete(id)

        if(!repos || repos.length == 0){
            return res.status(404).json({message:"Repo Not Found"})
        }

        res.json({message:"Repo Deleted"})

        
    } catch (error) {
        console.error(error)
        res.status(500).json({message:"Server Error"})
     }
}

const toggleVisibility = async (req,res)=>{
    const {id} = req.params
   
    try {
        const repo = await Repo.findById(id)

         if(!repos || repos.length == 0){
            return res.status(404).json({message:"Repo Not Found"})
        }

        repo.visibility = !repo.visibility
        const updatedRepo = await repo.save()
        
        res.json({message:"Repo Visibility Updated",reposiotries:updatedRepo})

    } catch (error) {
        console.error(error)
        res.status(500).json({message:"Server Error"})
     }
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