const fs = require("fs").promises;
const path = require("path");


async function getUuid() {
  const { v4: uuidv4 } = await import("uuid");
  return uuidv4;
}


const commitRepo = async (message) => {
  const uuidv4 = await getUuid();
  const repoPath = path.resolve(process.cwd(), ".Git");
  const stagingPath = path.join(repoPath, "Staged_Files");
  const commitPath = path.join(repoPath, "commits");

  try {
    const commmitId = uuidv4();
    const commitDir = path.join(commitPath, commmitId);
    await fs.mkdir(commitDir, { recursive: true });

    const files = await fs.readdir(stagingPath);
    for (const file of files) {
      await fs.copyFile(
        path.join(stagingPath, file),
        path.join(commitDir, file)
      );
    }

    await fs.writeFile(
      path.join(commitDir, "commit.json"),
      JSON.stringify({ message, date: new Date().toISOString() })
    );
    console.log(`Commit with ${commmitId} id created with message ${message}`);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { commitRepo }
