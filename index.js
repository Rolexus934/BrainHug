import { Command, commandUtil } from "./commandUtilities.js";
import { createRequire } from "module";
import { commands } from "./cmds/index.js";

const require = createRequire(import.meta.url);

const fs = require("fs");

let petraUtil = new commandUtil("$petra");

require("dotenv").config();

const {
  Client,
  Intents,
  MessageAttachment,
  MessagePayload,
} = require("discord.js");

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});
client.on("messageCreate", async (message) => {
  if (message.content.startsWith(petraUtil.baseKeyword)) {
    const { command, args } = petraUtil.commParser(message.content);

    if (commands[command] != undefined) {
      console.dir(commands[command]);
      commands[command].trigger(message, ...args);
    } else {
      message.reply(`Sorry, i don't know any command named ${command}`);
    }
  }
});
try {
  client.login(process.env.TOKEN);
} catch (error) {
  console.log("something went wrong ", error);
}
