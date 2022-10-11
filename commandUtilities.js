import * as fs from "node:fs";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { AttachmentBuilder } = require("discord.js");

class Command {
  constructor(path, nArgs, commandName) {
    this.path = path;
    this.commandName = commandName;
    this.nArgs = nArgs;
  }
  trigger = () => {};
}



//the sourceCommand class is a class created for a specific type of command
//that returns requires sending files to work. It provide us different methods and properties to work with a f
class SourceCommand extends Command {

  //constructor to the 
  constructor(path, sourceDirPath, nArgs, commandName) {
    super(path, nArgs, commandName);
    this.sourceDirPath = sourceDirPath;
    this.numSourceFiles = this.#countFiles(sourceDirPath);
  }

  //public methods
  //selects a random attachment located at the directory path and returns it
  createAttachment = (rand = true, num = 0) => {
    if ((rand = true)) num = this.#random(this.numSourceFiles, 1);

    return new AttachmentBuilder(`cmds/src/amongif/${num}.gif`);
  };

  //private methods

  //count the number of files at the command attachment folder
  #countFiles = (path) => {
    const nFiles = fs.readdirSync(path).length;
    return nFiles;
  };

  //randomizer function
  #random(end, start) {
    return Math.floor(Math.random() * (end - start + 1) + start);
  }
}

class commandUtil {
  constructor(baseKeyword) {
    this.baseKeyword = baseKeyword;
  }
  commParser = (rawargs) => {
    //skip "$petra "
    rawargs = rawargs.slice(this.baseKeyword.length + 1);
    const proccessedArgs = rawargs.split(" ");

    const argsObject = {};
    //add the command name to the arguments object
    argsObject["command"] = proccessedArgs[0];
    //add the argument to the arguments objet (skipping the command keyword)
    argsObject["args"] = proccessedArgs.slice(1);

    return argsObject;
  };
}

//exporting the command utilities classes for our discord bot
export { Command, commandUtil, SourceCommand };
