const mongoose = require('mongoose');
const Repo = require('../models/repoModel.js');
const User = require('../models/userModel.js');
const Issue = require('../models/issueModel.js');
const { S3, S3_BUCKET } = require('../config/aws-config.js');
const mime = require('mime-types'); 

const createRepo = async (req,res)=>{
    const {name,owner,issues,visibility,description,content} = req.body

    try {
        if(!name){
           return res.status(404).json({error:"Repo Name is required"})
        }
        if(!mongoose.Types.ObjectId.isValid(owner)){
             return res.status(404).json({error:"Owner ID is required"})
        }

        const existingRepo = await Repo.findOne({ name: name, owner: owner });
        if (existingRepo) {
            return res.status(400).json({ error: `Repository '${name}' already exists for this owner.` });
        }


        const newRepo = new Repo({
            name,
            owner,
            issues,
            visibility,
            description: description || 'No description provided.',
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
        const reposiotries = await Repo.find({}); 
        res.send(reposiotries)
    } catch (error) {
        console.error(error)
        res.status(500).json({message:"Server Error"})
     }

}

const fetchRepoById = async (req,res)=>{
    const {id} = req.params
    try {
        const repo = await Repo.findById(id).populate("owner").populate('issues'); 
        if (!repo) {
             return res.status(404).json({ message: "Repo Not Found" });
        }
        res.send(repo)
    } catch (error) {
        console.error(error)
         if (error instanceof mongoose.Error.CastError) {
             return res.status(400).json({ message: "Invalid Repo ID format" });
         }
        res.status(500).json({message:"Server Error"})
     }
}

const fetchRepoByName = async (req,res)=>{
     const {name} = req.params
    try {
        const repos = await Repo.find({name:name}).populate("owner").populate('issues');
         if (!repos || repos.length === 0) {
            return res.status(404).json({ message: "Repo Not Found" });
        }
        res.send(repos)
    } catch (error) {
        console.error(error)
        res.status(500).json({message:"Server Error"})
     }
}

const fetchRepoForCurrentUser = async (req,res)=>{

    const userId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid User ID format" });
    }

    try {
        const repos = await Repo.find({owner:userId}) 
        res.json({message:"Repos Found",repos}) 
    } catch (error) {
        console.error(error)
        res.status(500).json({message:"Server Error"})
     }
}

const updateRepoById = async(req,res)=>{
    const {id} = req.params
    const {description, visibility, name} = req.body

     if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid Repo ID format" });
    }

    try {
        const repo = await Repo.findById(id);
         if(!repo){ 
            return res.status(404).json({message:"Repo Not Found"})
        }

        if (description !== undefined) repo.description = description;
        if (visibility !== undefined) repo.visibility = visibility;
        if (name !== undefined) {
             // Add validation if changing name: check for conflicts with the same owner
             const existingRepo = await Repo.findOne({ name: name, owner: repo.owner, _id: { $ne: id } });
             if (existingRepo) {
                 return res.status(400).json({ error: `Another repository named '${name}' already exists for this owner.` });
             }
             repo.name = name;
         }

        const updatedRepo = await repo.save();

        res.json({message:"Repo Updated", repository: updatedRepo}) // Use singular 'repository'

    } catch (error) {
        console.error(error)
        res.status(500).json({message:"Server Error"})
     }
}

const deleteRepoById = async (req,res)=>{
    const {id} = req.params;

     if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid Repo ID format" });
    }

    try {
        const repo = await Repo.findByIdAndDelete(id);

        if(!repo){
            return res.status(404).json({message:"Repo Not Found"})
        }

        res.json({message:"Repo Deleted Successfully", repoId: id});

    } catch (error) {
        console.error(error)
        res.status(500).json({message:"Server Error"})
     }
}

const toggleVisibility = async (req,res)=>{
    const {id} = req.params;

     if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid Repo ID format" });
    }

    try {
        const repo = await Repo.findById(id);

         if(!repo){ 
            return res.status(404).json({message:"Repo Not Found"})
        }

        repo.visibility = !repo.visibility;
        const updatedRepo = await repo.save();

        res.json({message:"Repo Visibility Updated", repository: updatedRepo})

    } catch (error) {
        console.error(error)
        res.status(500).json({message:"Server Error"})
     }
}

const fetchRepoContent = async (req, res) => {
    const { userId, repoName } = req.params;
    const prefix = `${userId}/${repoName}/commit_files/`;

    try {
        console.log(`Fetching content list from S3 for prefix: ${prefix}`);
        const listParams = { Bucket: S3_BUCKET, Prefix: prefix };
        const listedObjects = await S3.listObjectsV2(listParams).promise();

        if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
            console.log(`No content found in S3 for ${userId}/${repoName}`);
             const dbRepo = await Repo.findOne({ name: repoName, owner: userId });
             if (!dbRepo) {
                  return res.status(404).json({ message: "Repository not found in database.", files: [] });
             }
            return res.json({ message: "Repository is empty.", files: [] });
        }

        const files = listedObjects.Contents
            .map(item => item.Key.substring(prefix.length))
            .filter(name => name && name !== 'commit_info.json');
        
          const dbRepo = await Repo.findOne({ name: repoName, owner: userId });
          dbRepo.content = files
          const updatedRepo = await dbRepo.save()
          
        console.log(`Found files for ${userId}/${repoName}:`, files);
        res.json({ message: "Files listed successfully", files: files });

    } catch (error) {
        console.error(`Error fetching repo content list from S3 for ${userId}/${repoName}:`, error);
        if (error.code === 'NoSuchBucket') {
             res.status(500).json({ message: "S3 Bucket configuration error." });
        } else if (error.statusCode === 403) {
             res.status(500).json({ message: "S3 Permissions error." });
        }
        else {
             res.status(500).json({ message: "Server Error fetching repository content list" });
        }
    }
};

// --- Updated Function for File Content ---
const fetchRepoFileContent = async (req, res) => {
    const { userId, repoName, fileName } = req.params;
    const decodedFileName = decodeURIComponent(fileName);
    const s3Key = `${userId}/${repoName}/commit_files/${decodedFileName}`;

    // Helper to guess language from filename extension
    const getLanguageFromExtension = (filename) => {
        const extension = filename.split('.').pop()?.toLowerCase();
        // Map common extensions to language identifiers used by frontend highlighters
        const langMap = {
            'js': 'javascript', 'jsx': 'javascript', 'ts': 'typescript', 'tsx': 'typescript',
            'py': 'python', 'java': 'java', 'c': 'c', 'cpp': 'cpp', 'cs': 'csharp',
            'html': 'html', 'css': 'css', 'scss': 'scss', 'less': 'less',
            'json': 'json', 'yaml': 'yaml', 'yml': 'yaml', 'md': 'markdown',
            'sh': 'bash', 'rb': 'ruby', 'go': 'go', 'php': 'php', 'xml': 'xml',
            'sql': 'sql', 'dockerfile': 'dockerfile', 'swift': 'swift', 'kt': 'kotlin'
            // Add more as needed
        };
        return langMap[extension] || 'plaintext'; // Default to plaintext
    };

    try {
        console.log(`Fetching file content from S3: ${s3Key}`);
        const params = { Bucket: S3_BUCKET, Key: s3Key };
        const fileData = await S3.getObject(params).promise();

        const s3ContentType = fileData.ContentType || 'application/octet-stream'; // Default if S3 doesn't provide type
        const detectedMimeType = mime.lookup(decodedFileName) || s3ContentType; // Prefer mime-types if available

        let isBinary = false;
        let fileContent = null;
        let language = 'plaintext';

        // Basic binary detection logic (can be expanded)
        // Check if mime type indicates text or if it's a common binary type
        if (!detectedMimeType.startsWith('text/') &&
            !['application/json', 'application/xml', 'application/javascript', 'application/yaml'].includes(detectedMimeType) &&
            (detectedMimeType.startsWith('application/') || detectedMimeType.startsWith('image/') || detectedMimeType.startsWith('audio/') || detectedMimeType.startsWith('video/')))
        {
             isBinary = true;
             console.log(`Detected binary file type: ${detectedMimeType}`);
        } else {
             // Assume text, try to decode as UTF-8
             try {
                fileContent = fileData.Body.toString('utf-8');
                language = getLanguageFromExtension(decodedFileName); // Guess language for text files
                console.log(`Detected text file type: ${detectedMimeType}, Language guess: ${language}`);
             } catch (decodeError) {
                 console.warn(`Could not decode file ${decodedFileName} as UTF-8, treating as binary.`, decodeError);
                 isBinary = true; // Fallback to binary if decoding fails
                 fileContent = null;
                 language = 'plaintext';
             }
        }


        console.log(`Successfully fetched ${decodedFileName}`);
        res.json({
            message: "File content fetched successfully",
            fileName: decodedFileName,
            contentType: detectedMimeType, // Send the detected MIME type
            isBinary: isBinary,           // Send the binary flag
            language: language,           // Send the language hint
            content: fileContent,         // Send content only if it's text (null if binary/error)
        });

    } catch (error) {
        console.error(`Error fetching file content from S3 for ${s3Key}:`, error);
        // Error handling remains the same...
        if (error.code === 'NoSuchKey') {
            res.status(404).json({ message: `File '${decodedFileName}' not found in repository.` });
        } else if (error.code === 'NoSuchBucket') {
            res.status(500).json({ message: "S3 Bucket configuration error." });
        } else if (error.statusCode === 403) {
            res.status(500).json({ message: "S3 Permissions error." });
        } else {
            res.status(500).json({ message: "Server Error fetching file content" });
        }
    }
};

module.exports = {
    createRepo,
    getAllRepo,
    fetchRepoById,
    fetchRepoByName,
    fetchRepoForCurrentUser,
    updateRepoById,
    deleteRepoById,
    toggleVisibility,
    fetchRepoContent,
    fetchRepoFileContent 
};