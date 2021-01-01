const { Schema, model } = require("mongoose");

const Detail_Invoice_Schema = new Schema({
    product: [
        {
            _id: {
                type: Schema.Types.ObjectId,
                ref: "Product",
            },
            quantity: {
                type: Number,
                default: 1,
            },
            status: {
                type: Boolean,
                default: false,
            },
        },
    ],
    totalPayment: {
        type: Number,
    },
    intoMoney: {
        type: Number,
    },
});

const DetailInvoice = model("DetailInvoice", Detail_Invoice_Schema);
module.exports = DetailInvoice;
