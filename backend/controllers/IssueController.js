const mongoose = require('mongoose');
const Repo = require('../models/repoModel.js'); 
const Issue = require('../models/issueModel.js');
const User = require('../models/userModel.js');


const createIssue = async (req, res) => {
 
    const { repoId } = req.params; 
    const { title, description } = req.body;

    
    if (!title || !description) {
        return res.status(400).json({ message: "Title and description are required." });
    }
    if (!mongoose.Types.ObjectId.isValid(repoId)) {
        return res.status(400).json({ message: "Invalid Repository ID format." });
    }

    try {
       
        const repoExists = await Repo.findById(repoId).select('_id'); 
        if (!repoExists) {
            return res.status(404).json({ message: "Repository not found." });
        }

        const issue = new Issue({
            title,
            description,
            repository: repoId, 
        });

        const savedIssue = await issue.save();

        res.status(201).json({ message: "Issue Created", issue: savedIssue }); 
    } catch (error) {
        console.error("Error creating issue:", error);
        res.status(500).json({ message: "Server Error creating issue" });
    }
};


const getAllIssuesForRepo = async (req, res) => {
    const { repoId } = req.params; 
    if (!mongoose.Types.ObjectId.isValid(repoId)) {
        return res.status(400).json({ message: "Invalid Repository ID format." });
    }

    try {
        
        const repoExists = await Repo.findById(repoId).select('_id');
        if (!repoExists) {
            return res.status(404).json({ message: "Repository not found." });
        }

       
        const issues = await Issue.find({ repository: repoId }).sort({ createdAt: -1 }); 

      
        res.status(200).json(issues); 

    } catch (error) {
        console.error(`Error fetching issues for repo ${repoId}:`, error);
        res.status(500).json({ message: "Server Error fetching issues" });
    }
};


const getIssueById = async (req, res) => {
    const { issueId } = req.params; 

    if (!mongoose.Types.ObjectId.isValid(issueId)) {
        return res.status(400).json({ message: "Invalid Issue ID format." });
    }

    try {
      
        const issue = await Issue.findById(issueId).populate('repository', 'name owner visibility'); // Populate useful repo info

        if (!issue) {
            return res.status(404).json({ message: "Issue not Found" });
        }

        res.status(200).json(issue); 

    } catch (error) {
        console.error(`Error fetching issue ${issueId}:`, error);
        res.status(500).json({ message: "Server Error fetching issue" });
    }
};


const updateIssueById = async (req, res) => {
    const { issueId } = req.params; 
    const { title, description, status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(issueId)) {
        return res.status(400).json({ message: "Invalid Issue ID format." });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) {
        if (!["open", "closed"].includes(status)) {
            return res.status(400).json({ message: "Invalid status value. Must be 'open' or 'closed'." });
        }
        updateData.status = status;
    }
    
    if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: "No update fields provided." });
    }

    try {
        const updatedIssue = await Issue.findByIdAndUpdate(
            issueId,
            { $set: updateData },
            { new: true, runValidators: true } 
        );

        if (!updatedIssue) {
            return res.status(404).json({ message: "Issue not Found" });
        }

        res.status(200).json({ message: "Issue Updated", issue: updatedIssue });
    } catch (error) {
        console.error(`Error updating issue ${issueId}:`, error);
       
        if (error.name === 'ValidationError') {
             return res.status(400).json({ message: "Validation Error", errors: error.errors });
        }
        res.status(500).json({ message: "Server Error updating issue" });
    }
};


const deleteIssueById = async (req, res) => {
    const { issueId } = req.params; 

    if (!mongoose.Types.ObjectId.isValid(issueId)) {
        return res.status(400).json({ message: "Invalid Issue ID format." });
    }

    try {
        const result = await Issue.findByIdAndDelete(issueId);

        if (!result) {
            return res.status(404).json({ message: "Issue not Found" });
        }

        res.status(200).json({ message: "Issue Deleted" }); 

    } catch (error) {
        console.error(`Error deleting issue ${issueId}:`, error);
        res.status(500).json({ message: "Server Error deleting issue" });
    }
};


module.exports = {
    createIssue,
    getAllIssuesForRepo,
    getIssueById,
    updateIssueById,
    deleteIssueById
};