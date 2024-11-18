const config = require('../../cfg/config.json');
const User = require('../../models/user');


exports.run = async (client, message, args) => {
    if (args.length !== 1) {
        return message.reply(`***Incorrect format***\nCorrect format is: \n\`${config.prefix}changesteamid [newSteamID]\`\nExample:\n\`${config.prefix}changesteamid 76561198877008754\``);
    }

    const newSteamId = args[0];

    if (!/^\d+$/.test(newSteamId) || !newSteamId.startsWith("7656") || newSteamId.length !== 17) {
        return message.reply("Invalid Steam ID entered.");
    }

    try {
        const user = await User.findOne({ where: { discordId: message.author.id } });

        if (!user) {
            return message.reply("No account linked. Please use the link command first.");
        }

        user.steamId = newSteamId;
        await user.save();

        return message.reply(`Your Steam ID has been updated to ${newSteamId}.`);
    } catch (err) {
        console.error(`Error changing Steam ID for ${message.author.username}:`, err);
        return message.reply("An error occurred while changing your Steam ID. Please try again later.");
    }
};
