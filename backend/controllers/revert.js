const fs = require('fs')
const path = require('path')
const {promisify} = require('util')

const readdir = promisify(fs.readdir)
const copyFile = promisify(fs.copyFile)

const revertRepo = async (commitId) => {
    const repoPath = path.resolve(process.cwd(),".Git")
    const commitsPath = path.join(repoPath,"commits")

    try {
        const commitDir = path.join(commitsPath,commitId)
        const files = await readdir(commitDir)
        const parentDir = path.resolve(repoPath,"..")

        for(const file of files){
            await copyFile(path.join(commitDir,file),path.join(parentDir,file))
        }

        console.log("Revert Successful")
    } catch (error) {
        console.error(error)
    }
}

module.exports = {revertRepo}