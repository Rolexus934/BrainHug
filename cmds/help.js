import { Command } from "../commandUtilities.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { EmbedBuilder } = require('discord.js');

const helpEmbed = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle('Welcome to the Brainhug Bot!')
    .setURL('https://discord.js.org/')
    .setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
    .setDescription('A Javascript based discord bot, where you can compile Brainf*ck code directly from a message!')
    .setThumbnail('https://i.imgur.com/AfFp7pu.png')
    .addFields(
        { name: 'Regular field title', value: 'Some value here' },
        { name: '\u200B', value: '\u200B' },
        { name: 'Inline field title', value: 'Some value here', inline: true },
        { name: 'Inline field title', value: 'Some value here', inline: true },
    )
    .addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
    .setImage('https://i.imgur.com/AfFp7pu.png')
    .setTimestamp()
    .setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });

const help = new Command('cmds/help.js', 0, 'help');

help.trigger = function (message, commandName, extra = []) {
    message.channel.send({
        embeds: [helpEmbed]
    });
}

export { help }

