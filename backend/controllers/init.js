const fs = require('fs').promises;
const path = require('path')


const initRepo = async () => {
   
    const repoPath = path.resolve(process.cwd(),".Git")
    const commitPath = path.join(repoPath,"commits")
    try {
        await fs.mkdir(repoPath,{recursive:true})
        await fs.mkdir(commitPath,{recursive:true})
        await fs.writeFile(
            path.join(repoPath,"config.json"),
            JSON.stringify({bucket:"Some thing Useful"})
        )
    } catch (error) {
        console.error(error)
    }
}

module.exports = {initRepo}