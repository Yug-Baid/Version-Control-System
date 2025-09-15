const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");
const { initRepo } = require("./controllers/init.js");
const {addRepo} = require("./controllers/add.js")
const {commitRepo} = require("./controllers/commit.js")
const {pushRepo} = require("./controllers/push.js")
const {pullRepo} = require("./controllers/pull.js");
const { revertRepo } = require("./controllers/revert.js");

yargs(hideBin(process.argv))
 .command("start", "for starting the server", {}, startServer)
  .command("init", "Used for Intializing Repo", {}, initRepo)
  .command("add <file>","Add a file to Repo",(yargs)=>{
    yargs.positional("file",{
        describe:"File to add to staging ares",
        type:"string"
    })
  },(argv)=>{
    addRepo(argv.file)
  }) .command("commit <message>","Commit the staged files",(yargs)=>{
    yargs.positional("message",{
        describe:"Commiting files from staging area",
        type:"string"
    })
  },(argv)=>{
    commitRepo(argv.message)
  })
  .command("push", "Used for pushing the commits to AWS", {}, pushRepo)
   .command("pull", "Used for pulling all commits from AWS", {}, pullRepo)
     .command("revert <commitId>","Used to revert files",(yargs)=>{
    yargs.positional("commitId",{
        describe:"Reverting file to Working dir",
        type:"string"
    })
  },(argv)=>{
    revertRepo(argv.commitId)
  }) 
   
  .demandCommand(1, "You need atleast one command")
  .help().argv;

function startServer(){
  console.log("Server Started")
}