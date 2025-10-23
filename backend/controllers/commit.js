const fs = require("fs").promises;
const path = require("path");


const commitRepo = async (userId, repoName, message) => {
  
  const repoBasePath = path.resolve(process.cwd(), ".Git", userId, repoName);
  const stagingPath = path.join(repoBasePath, "staged_files");
  const commitPath = path.join(repoBasePath, "commit_files"); 

  try {
    
    await fs.mkdir(commitPath, { recursive: true });

    const filesInStaging = await fs.readdir(stagingPath);
    console.log(filesInStaging)

    if (filesInStaging.length === 0) {
      console.log(`No changes staged for commit in ${userId}/${repoName}.`);
      return; 
    }

    console.log(`Committing ${filesInStaging.length} files for ${userId}/${repoName}...`);

    for (const file of filesInStaging) {
      const sourceFilePath = path.join(stagingPath, file);
      const destFilePath = path.join(commitPath, file);
      await fs.copyFile(sourceFilePath, destFilePath);
      await fs.unlink(sourceFilePath);
    }

   
    const commitInfo = {
      message: message,
      date: new Date().toISOString(),
    };
    await fs.writeFile(
      path.join(commitPath, "commit_info.json"), 
      JSON.stringify(commitInfo, null, 2) 
    );

    console.log(`Commit successful for ${userId}/${repoName} with message: "${message}"`);

  } catch (error) {
    console.error(`Error during commit for ${userId}/${repoName}:`, error);
  }
};

module.exports = { commitRepo };