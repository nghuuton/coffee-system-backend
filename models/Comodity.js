const { Schema, model } = require("mongoose");

const comoditySchema = new Schema({
    name: {
        type: String,
        maxlength: 30,
        required: true,
        unique: true,
    },
    price: {
        type: Number,
        required: true,
        default: 0,
    },
    quantity: {
        type: Number,
        default: 0,
        required: true,
    },
    unit: {
        type: Schema.Types.ObjectId,
        ref: "ConvertionalUnit",
    },
    bySupplier: {
        type: Schema.Types.ObjectId,
        ref: "Supplier",
    },
});

const Comdity = model("Comdity", comoditySchema);
module.exports = Comdity;
