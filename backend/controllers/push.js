const fs = require('fs').promises;
const path = require('path');
const { S3, S3_BUCKET } = require('../config/aws-config.js'); // Ensure S3 config is imported

const pushRepo = async (userId, repoName) => {

    const repoBasePath = path.resolve(process.cwd(), ".Git", userId, repoName);
    const commitPath = path.join(repoBasePath, "commit_files"); // Directory to push from

    try {
        console.log(`Starting push for ${userId}/${repoName} to S3 bucket ............`);
        const filesToPush = await fs.readdir(commitPath);

        if (filesToPush.length === 0) {
            console.log(`No committed files found locally for ${userId}/${repoName}. Nothing to push.`);
            return;
        }

        let uploadCount = 0;
        for (const file of filesToPush) {
            const localFilePath = path.join(commitPath, file);
            const fileContent = await fs.readFile(localFilePath);

            const s3Key = `${userId}/${repoName}/commit_files/${file}`;

            const params = {
                Bucket: S3_BUCKET,
                Key: s3Key,
                Body: fileContent,
            };

            await S3.upload(params).promise();
            console.log(`  Successfully uploaded ${file} to s3://${S3_BUCKET}/${s3Key}`);
            uploadCount++;
        }

        console.log(`Push completed for ${userId}/${repoName}. Uploaded ${uploadCount} files.`);

    } catch (error) {
         if (error.code === 'ENOENT') {
             console.error(`Error pushing: Local commit directory not found for ${userId}/${repoName}. Have you committed anything?`);
         } else {
            console.error(`Error pushing files for ${userId}/${repoName} to S3:`, error);
         }
    }
};

module.exports = { pushRepo };