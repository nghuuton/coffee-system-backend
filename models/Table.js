const { Schema, model } = require("mongoose");

const tableSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true,
    },
    status: {
        type: String,
    },
});

const Table = model("Table", tableSchema);
module.exports = Table;
