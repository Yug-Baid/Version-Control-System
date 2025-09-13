const fs = require('fs').promises
const path = require('path')

const addRepo = async (filePath) => {
    const repoPath = path.resolve(process.cwd(),".Git")
    const stagingPath = path.join(repoPath,"Staged_Files")

    try {
        await fs.mkdir(stagingPath,{recursive:true})
        const fileName = path.basename(filePath)
        await fs.copyFile(filePath,path.join(stagingPath,fileName))
        
    } catch (error) {
        console.error()
    }
}

module.exports = {addRepo}