const config = require('../cfg/config.json');
const DinoInfo = require('../models/dinoinfo');
const { getUserInfoByDiscordId } = require('../functions/connectors/sqlite-connector'); // Updated connector
const { queueHandler } = require("../functions/handlers/queue-handler");
const { checkRequestForSub } = require('../functions/helper');

exports.run = async (client, message, args) => {
    if (args.length !== 3) {
        return message.reply(`***Incorrect format***\nCorrect format is: \n\`${config.prefix}inject [dino] [gender] [safelogged status]\`\nExample:\n\`${config.prefix}inject Utah M Y\``);
    }

    const requestedDinoName = checkRequestForSub(args[0]);
    const dinoGender = args[1];
    const userInfo = await getUserInfoByDiscordId(message);
    const steamId = userInfo?.steamId;
    const isSafelogged = args[2];

    if (!steamId) {
        return message.reply(`You need to link your Steam ID using ${config.prefix}link.`);
    }

    if (!isSafelogged.toLowerCase().startsWith('y')) {
        return message.reply(`You must be safelogged before requesting a dinosaur.`);
    }

    try {
        const dinoInfo = await DinoInfo.findOne({ where: { codeName: requestedDinoName.toLowerCase() } });

        if (!dinoInfo) {
            return message.reply(`Incorrect dino name entered, please try again.`);
        }

        const dinoName = `${dinoInfo.codeName.charAt(0).toUpperCase()}${dinoInfo.codeName.slice(1)}`;
        const dinoPrice = dinoInfo.price;

        await queueHandler(["inject", dinoName, dinoGender, dinoPrice, steamId, message]);
    } catch (err) {
        console.error(`${message.author.username} | Error querying DinoInfo:\n${err}`);
        message.reply(`Something went wrong on the server. Please try again later.`);
    }
};
