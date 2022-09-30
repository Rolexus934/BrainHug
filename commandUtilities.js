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

class SourceCommand extends Command {
  constructor(path, sourceDirPath, nArgs, commandName) {
    super(path, nArgs, commandName);
    this.sourceDirPath = sourceDirPath;
    this.numSourceFiles = this.#countFiles(sourceDirPath);
  }

  //public methods
  createAttachment = (rand = true, num = 0) => {
    if ((rand = true)) num = this.#random(this.numSourceFiles, 1);

    return new AttachmentBuilder(`cmds/src/amongif/${num}.gif`);
  };

  //private methods
  #countFiles = (path) => {
    const nFiles = fs.readdirSync(path).length;
    return nFiles;
  };
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
    argsObject["command"] = proccessedArgs[0];
    argsObject["args"] = proccessedArgs.slice(1);

    return argsObject;
  };
}

export { Command, commandUtil, SourceCommand };
