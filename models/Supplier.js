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
        maxlength: 100,
    },
    phone: {
        type: String,
        maxlength: 10,
    },
});

const Supplier = model("Supplier", supplierSchema);
module.exports = Supplier;
