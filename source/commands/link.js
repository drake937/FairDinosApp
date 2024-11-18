const config = require('../cfg/config.json');
const User = require('../models/user');

exports.run = async (client, message, args) => {
    if (args.length !== 1) {
        return message.reply(`***Incorrect format***\nCorrect format is: \n\`${config.prefix}link [steam ID]\`\nExample:\n\`${config.prefix}link 76561198877008754\``);
    }

    const steamId = args[0];

    // Validate Steam ID format
    if (!/^\d+$/.test(steamId) || !steamId.startsWith("7656") || steamId.length !== 17) {
        return message.reply(`Invalid Steam ID entered. Please ensure the ID is 17 digits long and starts with '7656'.`);
    }

    try {
        // Check if the Steam ID is already linked to a user
        const existingUser = await User.findOne({ where: { steamId } });

        if (existingUser) {
            return message.reply("This Steam ID is already linked to another user. If you want to unlink it, please contact an admin.");
        }

        // Check if the user is already linked with a Discord ID (avoid linking multiple Discord accounts)
        const existingDiscordLink = await User.findOne({ where: { discordId: message.author.id } });
        if (existingDiscordLink) {
            return message.reply("You are already linked to a Steam ID. If you'd like to change it, please contact an admin.");
        }

        // Create the new user link
        await User.create({
            discordId: message.author.id,
            steamId,
        });

        console.log(`${message.author.username} linked their Steam ID (${steamId})`);

        // Notify the user
        message.reply(`Your Steam ID (${steamId}) has been successfully linked to your Discord account!`);
    } catch (err) {
        console.error(`Error linking Steam ID: ${err.message}`);
        message.reply("An error occurred while linking your Steam ID. Please try again later.");
    }
};
