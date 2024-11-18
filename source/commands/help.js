const { EmbedBuilder } = require("discord.js");

exports.run = async (client, message, args) => {
    const help = new EmbedBuilder()
        .setColor(0x0098FF)
        .setTitle('Fair Dinos Help')
        .setURL('https://discord.js.org/')
        .setAuthor({ 
            name: 'Fair Dinos Bot', 
            url: 'https://discord.js.org' 
        })
        .setDescription('Welcome to the Fair Dinos bot! This bot helps you manage your dinosaurs in The Isle game. Here\'s a quick guide to using the bot:')
        .addFields(
            { name: 'Commands', value: 'Here are some of the commands you can use:', inline: false },
            { name: '**!help**', value: 'Shows this help message.', inline: true },
            { name: '**!grow [dino] [steam ID]**', value: 'Grow a dinosaur to adulthood.', inline: true },
            { name: '**!link [steam ID]**', value: 'Link your Steam account to your Discord.', inline: true },
            { name: '**!price [dino]**', value: 'Get the price of a specific dinosaur.', inline: true },
            { name: '\u200B', value: '\u200B' },  // Empty field for spacing
            { name: 'Support', value: 'For issues or suggestions, feel free to reach out in our support channel.', inline: false }
        )
        .setTimestamp()
        .setFooter({ 
            text: 'Fair Dinos Bot | Made with love' 
        });
    
    message.reply({embeds: [help] });
};
