const { Schema, model } = require("mongoose");

const invoiceSchema = new Schema(
    {
        ownerTable: {
            type: Schema.Types.ObjectId,
            ref: "Table",
            required: true,
        },
        detailInvoice: {
            type: Schema.Types.ObjectId,
            ref: "DetailInvoice",
        },
        status: {
            type: Boolean,
            default: false,
        },
        createBy: {
            type: Schema.Types.ObjectId,
            ref: "Staff",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Invoice = model("Invoice", invoiceSchema);
module.exports = Invoice;
