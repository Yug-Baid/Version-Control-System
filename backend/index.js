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
const { revertRepo } = require("./controllers/revert.js");
const bodyParser = require("body-parser");
const { Socket } = require("dgram");
const mainRouter = require("./routes/main.router.js");

dotenv.config();

yargs(hideBin(process.argv))
  .command("start", "for starting the server", {}, startServer)
  .command("init", "Used for Intializing Repo", {}, initRepo)
  .command(
    "add <file>",
    "Add a file to Repo",
    (yargs) => {
      yargs.positional("file", {
        describe: "File to add to staging ares",
        type: "string",
      });
    },
    (argv) => {
      addRepo(argv.file);
    }
  )
  .command(
    "commit <message>",
    "Commit the staged files",
    (yargs) => {
      yargs.positional("message", {
        describe: "Commiting files from staging area",
        type: "string",
      });
    },
    (argv) => {
      commitRepo(argv.message);
    }
  )
  .command("push", "Used for pushing the commits to AWS", {}, pushRepo)
  .command("pull", "Used for pulling all commits from AWS", {}, pullRepo)
  .command(
    "revert <commitId>",
    "Used to revert files",
    (yargs) => {
      yargs.positional("commitId", {
        describe: "Reverting file to Working dir",
        type: "string",
      });
    },
    (argv) => {
      revertRepo(argv.commitId);
    }
  )

  .demandCommand(1, "You need atleast one command")
  .help().argv;

function startServer() {
  const app = express();
  const port = process.env.PORT || 3000;

  app.use(express.json());
  app.use(bodyParser.json());
  app.use('/',mainRouter)
  const mongo_url = process.env.MONGO_URL;
  app.use(cors({origin:"*"}))

  mongoose
    .connect(mongo_url)
    .then(() => {
      console.log("DB CONNECTED");
    })
    .catch((err) => {
      console.error(err);
    });

    const httpSever = http.createServer(app)
    const io = new Server(httpSever,{
      cors:{
        origin:"*",
        methods:["GET","POST"]
      },
    })

    io.on("connection",(socket)=>{
      socket.on("joinRoom",(userId)=>{
        user = userId;
        console.log("=====")
        console.log(user)
        console.log("=====")
        socket.join(userId)
      });
    });

    const db = mongoose.connection
    db.once("open",async()=>{
      console.log("CRUD Operations called")
    })

    httpSever.listen(port,()=>{
      console.log(`Server is listening to port ${port}`)
      console.log('Day 10 No Changes')
    })



}
