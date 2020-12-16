const { Schema, model } = require("mongoose");

const schemaConvertionalUnit = new Schema({
    unit: {
        type: Number,
        required: true,
    },
    unitMath: {
        type: String,
        required: true,
    },
});

const ConvertionalUnit = model("ConvertionalUnit", schemaConvertionalUnit);
module.exports = ConvertionalUnit;
