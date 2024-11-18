const { Client, GatewayIntentBits, Collection, ActivityType } = require("discord.js");
require('log-timestamp')(() => { return new Date().toISOString() + " %s" });
const fs = require("fs");
const path = require("path");
const { Rcon } = require('rcon-client');
const { addUserAmountBank } = require('./functions/api/economy-handler');
const { User } = require('./models/user');
const chalk = require('chalk');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const config = require('./cfg/config.json');
const { getServerInfo } = require("./functions/api/steam-api");

client.commands = new Collection();
client.config = config;

const activePlayers = new Map();

// Reading files under the events directory
fs.readdir(path.join(__dirname, "events"), (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        const event = require(`./events/${file}`);
        let eventName = file.split(".")[0];
        client.on(eventName, event.bind(null, client));
    });
});

// Reading files under the commands directory
fs.readdir(path.join(__dirname, "commands"), (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        if (!file.endsWith(".js")) return;
        let args = require(`./commands/${file}`);
        let commandName = file.split(".")[0];
        console.log(chalk.green(`[+] ${commandName}`));
        client.commands.set(commandName, args);
    });
});

// Reading files under the admin commands directory
fs.readdir(path.join(__dirname, "commands", "admin"), (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        if (!file.endsWith(".js")) return;
        let args = require(`./commands/admin/${file}`);
        let commandName = file.split(".")[0];
        console.log(chalk.yellow(`[+] ${commandName}`));
        client.commands.set(commandName, args);
    });
});

client.on("ready", async () => {
    client.user.setActivity(`the Admins`, { type: ActivityType.Watching });
    console.log("Bot is online and ready!");
    monitorServer();
    updateBotActivityWithPlayerCount(); // Start updating player count activity after bot is ready
});

async function monitorServer() {
    const rcon = new Rcon({
        host: config.serverInfo.server,
        port: config.serverInfo.rconPort,
        password: config.serverInfo.rconPassword,
    });

    try {
        await rcon.connect();
        console.log('Connected to RCON');
        rcon.on('message', (message) => {
            console.log('RCON Message:', message);
            if (message.includes('joined')) {
                const playerName = extractPlayerName(message);
                playerJoin(playerName);
            } else if (message.includes('left')) {
                const playerName = extractPlayerName(message);
                playerLeave(playerName);
            }
        });
    } catch (error) {
        console.error('RCON Error:', error);
        setTimeout(monitorServer, 5000); // Retry after 5 seconds if the connection fails
    }
}

function extractPlayerName(message) {
    const regex = /(\w+)/; // Adjust regex as needed for your server
    return message.match(regex)[0];
}

async function playerJoin(playerName) {
    activePlayers.set(playerName, Date.now());
    console.log(`${playerName} joined the server.`);
}

async function playerLeave(playerName) {
    const joinTime = activePlayers.get(playerName);
    if (!joinTime) return;

    const playTime = (Date.now() - joinTime) / 1000; // Playtime in seconds
    const pointsEarned = Math.floor(playTime / 60) * 3; // 3 points per minute

    console.log(`${playerName} left the server. Playtime: ${playTime} seconds. Points: ${pointsEarned}`);

    const discordId = await getDiscordIdFromPlayerName(playerName);
    if (discordId) {
        await addUserAmountBank(discordId, pointsEarned);
        console.log(`Awarded ${pointsEarned} points to ${playerName} (Discord ID: ${discordId})`);
    }

    activePlayers.delete(playerName);
}

async function getDiscordIdFromPlayerName(playerName) {
    const user = await User.findOne({ where: { steamId: playerName } });
    return user?.discordId;
}

const updateBotActivityWithPlayerCount = async () => {
    try {
        // Check if client.user is available
        if (!client.user) {
            console.error("Client user is not available yet.");
            return;
        }

        const playerCount = await getServerInfo(config.serverInfo.server, config.serverInfo.queryPort);
        if (playerCount) {
            client.user.setActivity(`${playerCount} players`, { type: ActivityType.Watching });
        } else {
            console.error("Could not retrieve player count.");
        }
    } catch (error) {
        console.error(`Error updating player count: ${error.message}`);
    } finally {
        setTimeout(updateBotActivityWithPlayerCount, 5000); // Repeat every 5 seconds
    }
};

updateBotActivityWithPlayerCount();

client.login(config.token);
