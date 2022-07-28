import { SourceCommand } from "../commandUtilities.js";

const amogus = new SourceCommand(
  "cmds/amongif.js",
  "cmds/src/amongif",
  "amongif",
  1
);

amogus.trigger = function (message, num = 1, extra = []) {
  if (num > amogus.numSourceFiles) num = amogus.numSourceFiles;
  for (let x = 1; x <= num; x++) {
    console.log("Creating attachment");
    const attachment = this.createAttachment();
    console.dir(attachment);
    message.channel.send({
      files: [attachment],
    });
  }
};

export { amogus };
