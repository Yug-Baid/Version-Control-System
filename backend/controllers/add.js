const fs = require('fs').promises;
const path = require('path');

const addRepo = async (userId, repoName, filePath) => {
    const repoBasePath = path.resolve(process.cwd(), ".Git", userId, repoName);
    const stagingPath = path.join(repoBasePath, "staged_files");

    try {
        await fs.mkdir(stagingPath, { recursive: true });

        const fileName = path.basename(filePath);
        const destinationPath = path.join(stagingPath, fileName);

        await fs.copyFile(filePath, destinationPath);
        console.log(`Added '${fileName}' to staging area for repository ${userId}/${repoName}`);

    } catch (error) {
         if (error.code === 'ENOENT') {
            console.error(`Error: File not found at path: ${filePath}`);
        } else {
            console.error(`Error adding file '${path.basename(filePath)}' for ${userId}/${repoName}:`, error);
        }
    }
};

module.exports = { addRepo };