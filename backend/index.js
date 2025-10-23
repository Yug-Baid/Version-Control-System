const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const yargs = require("yargs");
const {Server} = require('socket.io')
const { hideBin } = require("yargs/helpers");
const { initRepo } = require("./controllers/init.js");
const { addRepo } = require("./controllers/add.js");
const { commitRepo } = require("./controllers/commit.js");
const { pushRepo } = require("./controllers/push.js");
const { pullRepo } = require("./controllers/pull.js");
const bodyParser = require("body-parser");
const mainRouter = require("./routes/main.router.js");

dotenv.config();

const addRepoArgs = (yargs) => {
  yargs
    .positional("userId", {
      describe: "User ID owning the repository",
      type: "string",
    })
    .positional("repoName", {
      describe: "Name of the repository",
      type: "string",
    });
};

yargs(hideBin(process.argv))
  .command("start", "for starting the server", {}, startServer)
  .command(
    "init <userId> <repoName>", 
    "Used for Intializing Repo structure locally (optional if handled by add/commit)",
    addRepoArgs, 
    (argv) => {
      initRepo(argv.userId, argv.repoName);
    }
  )
  .command(
    "add <userId> <repoName> <file>", 
    "Add a file to a specific Repo's staging area",
    (yargs) => {
      addRepoArgs(yargs); 
      yargs.positional("file", {
        describe: "File to add to staging area",
        type: "string",
      });
    },
    (argv) => {
      addRepo(argv.userId, argv.repoName, argv.file);
    }
  )
  .command(
    "commit <userId> <repoName> <message>", 
    "Commit the staged files for a specific repo",
    (yargs) => {
      addRepoArgs(yargs); 
      yargs.positional("message", {
        describe: "Commiting files from staging area",
        type: "string",
      });
    },
    (argv) => {
      commitRepo(argv.userId, argv.repoName, argv.message); 
    }
  )
  .command(
    "push <userId> <repoName>", 
    "Used for pushing the commits of a specific repo to AWS S3",
     addRepoArgs, 
    (argv) => {
      pushRepo(argv.userId, argv.repoName); 
    }
   )
  .command(
    "pull <userId> <repoName>",
    "Used for pulling all commits for a specific repo from AWS S3",
    addRepoArgs, 
    (argv) => {
      pullRepo(argv.userId, argv.repoName);
    }
  )
  .demandCommand(1, "You need at least one command")
  .help().argv;


function startServer() {
  const app = express(); 
  const port = process.env.PORT || 3000;

 
  app.use(cors({ origin: "*" })); 
  app.use(express.json()); 
  app.use(bodyParser.json());
  app.use('/', mainRouter); 

  const mongo_url = process.env.MONGO_URL;
  if (!mongo_url) {
    console.error("Error: MONGO_URL not found in .env file. Server cannot start.");
    process.exit(1); 
  }

  mongoose.connect(mongo_url)
    .then(() => {
      console.log("DB CONNECTED");

      app.listen(port, () => {
        console.log(`Server is listening on port ${port}`);
      });
    })
    .catch((err) => {
      console.error("DB Connection Error:", err);
      process.exit(1); 
    });

}