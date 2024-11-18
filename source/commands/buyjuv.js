const config = require('../cfg/config.json');
const DinoInfo = require('../models/dinoinfo');
const { getUserAmount, deductUserAmountCash } = require('../functions/api/economy-handler');
const { queueHandler } = require("../functions/handlers/queue-handler");

exports.run = async (client, message, args) => {
    if (args.length !== 3) {
        return message.reply(`***Incorrect format***\nCorrect format is: \n\`${config.prefix}buyjuv [dinoName] [safelogged status] [steam ID]\``);
    }

    const [requestedDinoName, isSafelogged, steamId] = args;

    if (!isSafelogged.toLowerCase().startsWith('y')) {
        return message.reply(`You must be safelogged before requesting a dinosaur.`);
    }

    try {
        // Query DinoInfo to get details of the requested dino
        const dinoInfo = await DinoInfo.findOne({ where: { codeName: requestedDinoName.toLowerCase() } });

        if (!dinoInfo) {
            return message.reply(`Incorrect dino name entered, please try again.`);
        }

        if (!dinoInfo.survival) {
            return message.reply(`Grows for non-survival juveniles are not available at the moment.`);
        }

        const dinoPrice = dinoInfo.price; // Assume price is set for juvenile dinos
        const discordId = message.author.id;

        // Fetch user balance
        const { cash } = await getUserAmount(discordId);

        if (cash < dinoPrice) {
            return message.reply(`You do not have enough cash to purchase this dino. Dino price: ${dinoPrice}`);
        }

        // Deduct price from user's cash
        const deductionSuccess = await deductUserAmountCash(discordId, dinoPrice);
        if (!deductionSuccess) {
            return message.reply(`Failed to process your payment. Please try again.`);
        }

        const dinoName = `${dinoInfo.codeName.charAt(0).toUpperCase()}${dinoInfo.codeName.slice(1)}JuvS`;

        // Add grow request to the queue
        await queueHandler(["grow", dinoName, 0, steamId, message]);

        message.reply(`Your juvenile dino (${dinoName}) purchase was successful for ${dinoPrice} cash.`);
    } catch (err) {
        console.error(`${message.author.username} | Error querying DinoInfo:\n${err}`);
        message.reply(`Something went wrong on the server. Please try again later.`);
    }
};
