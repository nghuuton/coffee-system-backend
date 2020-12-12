const { Schema, model } = require("mongoose");

const supplierSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true,
        maxlength: 100,
    },
    address: {
        type: String,
        unique: true,
        maxlength: 100,
        required: true,
    },
    phone: {
        type: String,
        maxlength: 10,
        required: true,
    },
});

const Supplier = model("Supplier", supplierSchema);
module.exports = Supplier;
