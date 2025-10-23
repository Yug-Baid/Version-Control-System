const fs = require('fs').promises;
const path = require('path');

const initRepo = async (userId, repoName) => {

    const repoBasePath = path.resolve(process.cwd(), ".Git", userId, repoName);
    const stagedPath = path.join(repoBasePath, "staged_files");
    const commitPath = path.join(repoBasePath, "commit_files");
    try {

        await fs.mkdir(stagedPath, { recursive: true });
        await fs.mkdir(commitPath, { recursive: true });
        console.log(`Initialized repository structure for ${userId}/${repoName}`);
        
    } catch (error) {
        console.error(`Error initializing repo structure for ${userId}/${repoName}:`, error);
    }
};

module.exports = { initRepo };