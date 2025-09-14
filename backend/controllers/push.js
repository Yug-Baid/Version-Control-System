const fs = require('fs').promises
const path = require('path')
const {S3,S3_BUCKET} = require('../config/aws-config.js')

const pushRepo = async () => {
    const repoPath = path.resolve(process.cwd(),".Git")
    const commitsPath = path.join(repoPath,"commits")

    try {
        const commitDirs = await fs.readdir(commitsPath)
        for(const commitDir of commitDirs){
            const commitPath = path.join(commitsPath,commitDir)
            const files = await fs.readdir(commitPath)

        for(const file of files){
             const filePath = path.join(commitPath,file)
             const fileContent = await fs.readFile(filePath)
             const params = {
                Bucket:S3_BUCKET,
                Key:`commits/${commitDir}/${file}`,
                Body:fileContent,
             };
              await S3  .upload(params).promise()
        }
       
        }
        console.log("All commits pushed to S3")

    } catch (error) {
        console.log(error)
    }
}

module.exports = {pushRepo}