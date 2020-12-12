const { Schema, model } = require("mongoose");

const typeSchema = new Schema({
    name: {
        type: String,
        unique: true,
        require: true,
    },
});

const Type = model("Type", typeSchema);
module.exports = Type;
