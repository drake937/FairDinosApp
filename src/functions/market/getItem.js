const Item = require("../../schemas/item");

module.exports = (client) => {
    client.getItem = async (userId, guildId) => {
        const storedItem = await Balance.findOne({ 
            userId: userId, 
            guildId: guildId, 
        });

        if (!storedBalance) return false;
        else return storedBalance;

    }
};