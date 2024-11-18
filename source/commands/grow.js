const config = require('../cfg/config.json');
const DinoInfo = require('../models/dinoinfo'); // Sequelize Model
const { queueHandler } = require("../functions/handlers/queue-handler");
const { checkRequestForSub } = require('../functions/helper');

exports.run = async (client, message, args) => {
    if (args.length !== 3) {
        return message.reply(`***Incorrect format***\nCorrect format is: \n\`${config.prefix}grow [dino] [steam ID] [safelogged status]\`\nExample:\n\`${config.prefix}grow Utah 76561198877008754 Y\``);
    }

    let requestedDinoName = args[0];
    const steamId = args[1];
    const isSafelogged = args[2];

    if (!/^\d+$/.test(steamId)) {
        return message.reply(`Invalid Steam ID entered.`);
    }

    if (!isSafelogged.toLowerCase().startsWith('y')) {
        return message.reply(`You must be safelogged before requesting a dinosaur.`);
    }

    requestedDinoName = checkRequestForSub(requestedDinoName);

    try {
        const dinoInfo = await DinoInfo.findOne({ where: { codeName: requestedDinoName.toLowerCase() } });

        if (!dinoInfo) {
            return message.reply(`Incorrect dino name entered, please try again.`);
        }

        let dinoName = dinoInfo.survival && !dinoInfo.toString().includes("subs")
            ? `${dinoInfo.codeName}AdultS`
            : dinoInfo.codeName;

        dinoName = dinoName.charAt(0).toUpperCase() + dinoName.slice(1);
        const dinoPrice = dinoInfo.price;

        await queueHandler(["grow", dinoName, dinoPrice, steamId, message]);
    } catch (err) {
        console.error(`${message.author.username} | Error querying SQLite DinoInfo:\n${err}`);
        message.reply(`Something went wrong on the server. Please try again later.`);
    }
};
