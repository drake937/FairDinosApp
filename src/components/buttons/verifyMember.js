module.exports = {
    data: {
        name: `verifyMember`
    },
    async execute(interaction, client) {
        const role = interaction.guild.roles.cache.get('1126360014718767236');
        if (!role){
            console.log("User used a non-existant role.");
            return;
        }
        else if (role){
            const collector = await interaction.channel.createMessageComponentCollector();
            collector.on('collect', async(i) => {
                const member = i.member;
                if (i.customId === 'verifyMember') {
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