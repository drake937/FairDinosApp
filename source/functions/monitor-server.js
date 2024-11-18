const { Rcon } = require('rcon-client');
const { addUserAmountBank } = require('../api/economy-handler');
const { User } = require('../../models/user'); // Assuming you're using Sequelize for your models

const config = {
    host: 'YOUR_SERVER_IP', // e.g., 174.126.179.19
    port: 27020,  // Default RCON port for The Isle
    password: 'YOUR_RCON_PASSWORD'
};

const activePlayers = new Map(); // To track playtime

async function monitorServer() {
    const rcon = new Rcon(config);

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
    }
}

function extractPlayerName(message) {
    // Logic to extract player name from RCON message
    // Modify this based on your RCON message format
    const regex = /(\w+)/; // Adjust regex as needed
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
    const pointsEarned = Math.floor(playTime / 60); // 1 point per minute

    console.log(`${playerName} left the server. Playtime: ${playTime} seconds. Points: ${pointsEarned}`);

    // Fetch Discord ID linked with Steam ID
    const discordId = await getDiscordIdFromPlayerName(playerName);
    if (discordId) {
        await addUserAmountBank(discordId, pointsEarned);
        console.log(`Awarded ${pointsEarned} points to ${playerName} (Discord ID: ${discordId})`);
    }

    activePlayers.delete(playerName);
}

async function getDiscordIdFromPlayerName(playerName) {
    // Fetch Discord ID linked with the Steam ID
    const user = await User.findOne({ where: { steamId: playerName } }); // Assuming playerName is Steam ID
    return user?.discordId;
}

monitorServer();
