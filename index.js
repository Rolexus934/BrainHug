import { Command, commandUtil } from "./commandUtilities.js";
import { createRequire } from "module";
import { commands } from "./cmds/index.js";

const require = createRequire(import.meta.url);

const fs = require("fs");

let brainHugUtil = new commandUtil("$brainhug");

require("dotenv").config();

const {
  Client,
  GatewayIntentBits,
  Partials,
  AttachmentBuilder,
  MessagePayload,
} = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});
client.on("messageCreate", async (message) => {
  if (message.content.startsWith(brainHugUtil.baseKeyword)) {
    const { command, args } = brainHugUtil.commParser(message.content);

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
