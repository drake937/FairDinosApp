const Item = require("../../schemas/item");
const { Types } = require("mongoose");

module.exports = (client) => {
    client.fetchItem = async (userId, guildId) => {
        let storedItem = await Item.findOne({ 
            userId: userId, 
            guildId: guildId, 
        });

        if (!storedItem) {
            storedItem = await new Item({
                _id: new Types.ObjectId(),
                userId: userId,
                guildId: guildId
            });

            await storedItem
                .save()
                .then(async (item) =>{
                    console.log(
                        `[Item Created]: UserID: ${item.userId}, GuildID: ${item.guildId}`
                    );
                })
                .catch(console.error);
            return storedItem;            
        } else return storedItem;
    };
};