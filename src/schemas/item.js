const { Schema, model } = require("mongoose");
const itemSchema = new Schema({
    _id: Schema.Types.ObjectId,
    userId: String, 
    guildId: String, 
    item: { type: Number, default: 0 },
});

module.exports = model("Item", itemSchema, "items");