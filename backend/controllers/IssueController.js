const mongoose = require('mongoose')
const Repo = require('../models/repoModel.js')
const User = require('../models/userModel.js')
const Issue = require('../models/issueModel.js')

const createIssue =  async (req,res)=>{
    const {id} = req.params
    const {title,description} = req.body
    
    try {
        const issue = new Issue({
            title,
            description,
            repository:id,
        })

        await issue.save()
        res.status(200).json({message:"Issue Created",issue})
    } catch (error) {
        console.error(error)
        res.status(500).json({message:"Server Error"})
    }
}

const updateIssueById = async (req,res)=>{
      const {id} = req.params
    const {title,description,status} = req.body
    
    try {
        const issue = await Issue.findById(id)

        if(!issue){
            return res.status(400).json({message:"Issue not Found"})
        }

        issue.title = title
        issue.description = description
        issue.status = status

        await issue.save()

        res.status(200).json({message:"Issue Updated",issue})
    } catch (error) {
        console.error(error)
        res.status(500).json({message:"Server Error"})
    }
}

const deleteIssueById = async (req,res)=>{
    const {id} = req.params
    try {
        const issue = await Issue.findByIdAndDelete(id)
        if(!issue){
            return res.status(400).json({message:"Issue not Found"})
        }

         res.status(200).json({message:"Issue Deleted"})

    } catch (error) {
        console.error(error)
        res.status(500).json({message:"Server Error"})
    }
}


const getAllIssues = async (req,res)=>{
         const {id} = req.params
    
    try {
        const issues = await Issue.findById({repository : id})

        if(!issue){
            return res.status(400).json({message:"Issue not Found"})
        }
        
        res.status(200).json({message:"Issues",issues})
    } catch (error) {
        console.error(error)
        res.status(500).json({message:"Server Error"})
    }
}


const getIssueById = async (req,res)=>{
            const {id} = req.params
    
    try {
        const issues = await Issue.findById(id)

        if(!issue){
            return res.status(400).json({message:"Issue not Found"})
        }
        
        res.status(200).json({message:"Issues",issues})
    } catch (error) {
        console.error(error)
        res.status(500).json({message:"Server Error"})
    }
}

module.exports = {
    createIssue,
    updateIssueById,
    deleteIssueById,
    getAllIssues,
    getIssueById
}