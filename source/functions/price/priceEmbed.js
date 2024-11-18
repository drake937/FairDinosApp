const { EmbedBuilder } = require('discord.js');
const DinoInfo = require('../../models/dinoinfo'); // Sequelize Model

const priceEmbed = async (message) => {
    try {
        const dinoInfos = await DinoInfo.findAll();
        const maxDinoTier = await DinoInfo.max('tier');

        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Dinosaur Price List')
            .setDescription('List of prices for all Legacy dinos.');

        for (let i = 1; i <= maxDinoTier; i++) {
            const dinosInTier = dinoInfos.filter(dino => dino.tier === i);
            if (dinosInTier.length > 0) {
                const dinoNames = dinosInTier.map(dino => dino.name).join('\n- ');
                const price = dinosInTier[0].price.toLocaleString();
                embed.addFields({
                    name: `Tier ${i} - ${price} :moneybag:`,
                    value: `- ${dinoNames}`,
                    inline: false
                });
            }
        }

        await message.reply({ embeds: [embed] });
    } catch (error) {
        console.error("Error generating price embed:", error);
        message.reply("An error occurred while fetching dino prices.");
    }
};

module.exports = { priceEmbed };
