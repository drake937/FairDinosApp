/*
const Balance = require('../../schemas/balance');

//keep whole numbers to maintain integer datatype.
module.exports = {
    name: "messageCreate",
    async execute(message, client) {
        if (message.author.bot) return;
        
        const randomAmount = Math.random() * (1200 - 800) + 800;
        const storedBalance = await client.fetchBalance(
            message.author.id, 
            message.guild.id
        );
        
        console.log(message.author.id);
        console.log(message.guild.id);

        await Balance.findOneAndUpdate(
            { _id: storedBalance._id}, 
            { 
                balance: await client.toFixedNumber(
                    storedBalance.balance + randomAmount
                ),
            }
        );
    },
};
*/