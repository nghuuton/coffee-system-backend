const { Schema, model } = require("mongoose");

const Invoice_Issue_Schema = new Schema(
    {
        totalPayment: {
            type: Number,
            required: true,
        },
        comoditys: [
            {
                _id: {
                    type: Schema.Types.ObjectId,
                    ref: "Comdity",
                },
                quantity: {
                    type: Number,
                    default: 0,
                },
            },
        ],
        status: {
            type: Schema.Types.Boolean,
            default: false,
        },
        bySupplier: {
            type: Schema.Types.ObjectId,
            ref: "Supplier",
        },
        byStaff: {
            type: Schema.Types.ObjectId,
            ref: "Staff",
        },
    },
    { timestamps: true }
);

const InvoiceIssue = model("InvoiceIssue", Invoice_Issue_Schema);
module.exports = InvoiceIssue;
