const fs = require('fs').promises
const path = require('path')

const addRepo = async (filePath) => {
    const repoPath = path.resolve(process.cwd(),".Git")
    const stagingPath = path.join(repoPath,"Staged_Files")

    try {
        await fs.mkdir(stagingPath,{recursive:true})
        const fileName = path.basename(filePath)
        await fs.copyFile(fileName,path.join(stagingPath,fileName))
        console.log("Done")

        
    } catch (error) {
        console.error()
    }
}

module.exports = {addRepo}