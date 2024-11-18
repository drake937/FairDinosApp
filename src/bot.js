require('dotenv').config();
const { token, databaseToken } = process.env;
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { connect } = require('mongoose');
const fs = require('fs');

const { Guilds, GuildMessages } = GatewayIntentBits
const client = new Client({ intents: [Guilds, GuildMessages, GatewayIntentBits.MessageContent] });
client.commands = new Collection();
client.buttons = new Collection();
client.selectMenus = new Collection();
client.modals = new Collection();
client.commandArray = [];

const functionFolders = fs.readdirSync(`./src/functions`);
for (const folder of functionFolders) {
    const functionFiles = fs
        .readdirSync(`./src/functions/${folder}`)
        .filter(file => file.endsWith(".js"));
    for (const file of functionFiles) 
        require(`./functions/${folder}/${file}`)(client);
}

client.handleEvents();
client.handleCommands();
client.handleComponents();
client.login(token);
(async () => {
    await connect(databaseToken).catch(console.error);
})();













































/*
import { config } from 'dotenv';
import { Client, GatewayIntentBits, Routes } from 'discord.js';
import { REST } from '@discordjs/rest';
import OrderCommand from './commands/order.js';
import RolesCommand from './commands/roles.js';
import UsersCommand from './commands/user.js';
import ChannelsCommand from './commands/channel.js';

config();

const TOKEN = process.env.TUTORIAL_BOT_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
    ],
});

const rest = new REST({ version: '10' }).setToken(TOKEN);

//displays bot username when logged in successfully
client.on('ready', () => {console.log(`${client.user.tag} has logged in!`)});

client.on('interactionCreate', (interaction) => {
    if (interaction.isChatInputCommand()) {
        const food = interaction.options.get('food').value;
        const drink = interaction.options.get('drink').value;
        interaction.reply({
            content: `You ordered ${food} and ${drink}` ,
        });
    }
});
*/

//displays username, date, and message content
/*
client.on('messageCreate', (message) => {
    console.log(message.author.tag + ' on ' + message.createdAt.toDateString() + ' said:');
    console.log(message.content);
});
*/
/*
async function main() {

    const commands = [
        OrderCommand, 
        RolesCommand, 
        UsersCommand, 
        ChannelsCommand, 
 
    ];

    try {
        console.log('Started refreshing application (/) commands.');
        await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
            body: commands,
        });
        client.login(TOKEN);
    } catch (err) {
        console.log(err);
    }
}

main();
*/