module.exports = {
    data: {
        name: `alphaTest`
    },
    async execute(interaction, client) {
        const role = interaction.guild.roles.cache.get('1127081896208257034');
        if (!role){
            console.log("User used a non-existant role.");
            return;
        }
        else if (role){
            const collector = await interaction.channel.createMessageComponentCollector();
            collector.on('collect', async(i) => {
                const member = i.member;
                if (i.customId === 'alphaTest') {
                    member.roles.add(role);  
                        i.reply({
                            content: `You recieved the ${role} role.`,
                            ephemeral: true,
                        });
                }
            });

        } else {
            await interaction.reply({
                content: `Something went wrong.`,
                ephemeral: true,
            })
        }

    },
};