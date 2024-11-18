const { model } = require("mongoose");

module.exports = {
    data: {
        name: `example-menu`
    },
    async execute(interaction, client) {
        
        if (interaction.values == 2){
            await interaction.reply({
                content: `Safelog and try again.`,
            });
        }
        else {
            await interaction.reply({
                content: `You selected: ${interaction.values[0]}`,
            });
        }

    },
};