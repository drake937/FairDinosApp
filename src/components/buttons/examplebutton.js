
module.exports = {
    data: {
        name: `example-button`
    },
    async execute(interaction, client) {
        await interaction.reply('The button was clicked!');
    },
};