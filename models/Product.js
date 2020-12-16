const { Schema, model } = require("mongoose");

const productSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true,
    },
    image: {
        type: String,
    },
    type: {
        type: Schema.Types.ObjectId,
        ref: "Type",
    },
    comoditys: [{ type: Schema.Types.ObjectId, ref: "Comdity" }],
    price: {
        type: Number,
        default: 0,
    },
});

const Product = model("Product", productSchema);
module.exports = Product;
