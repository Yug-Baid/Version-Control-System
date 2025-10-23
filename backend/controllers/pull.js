const fs = require('fs').promises;
const path = require('path');
const { S3, S3_BUCKET } = require('../config/aws-config.js'); // Ensure S3 config is imported

const pullRepo = async (userId, repoName) => {
    const repoBasePath = path.resolve(process.cwd(), ".Git", userId, repoName);
    const localCommitPath = path.join(repoBasePath, "commit_files");

    const s3Prefix = `${userId}/${repoName}/commit_files/`;

    try {
        console.log(`Starting pull for ${userId}/${repoName} from S3 bucket ...........`);

        await fs.mkdir(localCommitPath, { recursive: true });

        const listParams = {
            Bucket: S3_BUCKET,
            Prefix: s3Prefix,
        };
        const listedObjects = await S3.listObjectsV2(listParams).promise();

        if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
            console.log(`No files found in S3 for ${userId}/${repoName} at prefix ${s3Prefix}.`);
            return;
        }

        console.log(`Found ${listedObjects.Contents.length} file(s) in S3. Downloading...`);
        let downloadCount = 0;

        for (const s3Object of listedObjects.Contents) {
            const s3Key = s3Object.Key;
            const fileName = path.basename(s3Key);

            if (!fileName || s3Key === s3Prefix) continue;

            const localFilePath = path.join(localCommitPath, fileName);

            const getParams = {
                Bucket: S3_BUCKET,
                Key: s3Key,
            };

            const fileData = await S3.getObject(getParams).promise();
            await fs.writeFile(localFilePath, fileData.Body);
            console.log(`  Downloaded s3://${S3_BUCKET}/${s3Key} to ${localFilePath}`);
            downloadCount++;
        }

        console.log(`Pull completed for ${userId}/${repoName}. Downloaded ${downloadCount} files.`);

    } catch (error) {
        console.error(`Error pulling files for ${userId}/${repoName} from S3:`, error);
    }
};

module.exports = { pullRepo };