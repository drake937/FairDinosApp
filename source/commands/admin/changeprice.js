const DinoInfo = require('../../models/dinoinfo'); // Import DinoInfo model
const config = require('../../cfg/config.json');

exports.run = async (client, message, args) => {
    if (args.length !== 3) {
        return message.reply(
            `***Incorrect format***\nCorrect format is: \n\`${config.prefix}changeprice [dinoName] [dinoPrice] [dinoTier]\`\nExample:\n\`${config.prefix}changeprice Utah 200000 7\``
        );
    }

    const [dinoName, dinoPrice, dinoTier] = args;

    try {
        // Find the DinoInfo record by codeName
        const dino = await DinoInfo.findOne({ where: { codeName: dinoName.toLowerCase() } });

        if (!dino) {
            return message.reply(`Dino with codeName "${dinoName}" not found.`);
        }

        // Update the dino's price and tier
        dino.price = parseInt(dinoPrice, 10);
        dino.tier = parseInt(dinoTier, 10);
        await dino.save();

        return message.reply("Price and tier change successful.");
    } catch (err) {
        console.error('Error updating dino price and tier:', err);
        return message.reply("An error occurred while updating the dino's price and tier. Please try again later.");
    }
};
