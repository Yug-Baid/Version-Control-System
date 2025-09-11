const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");
const { initRepo } = require("./controllers/init.js");
const {addRepo} = require("./controllers/add.js")

yargs(hideBin(process.argv))
  .command("init", "Used for Intializing Repo", {}, initRepo)
  .command("add <file>","Add a file to Repo",(yargs)=>{
    yargs.positional("file",{
        describe:"File to add to staging ares",
        type:"string"
    })
  },addRepo)
  .demandCommand(1, "You need atleast one command")
  .help().argv;
