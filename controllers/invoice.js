const Invoice = require("../models/Invoice");
const Table = require("../models/Table");
const DetailInvoice = require("../models/Detail_Invoice");

const getInoiveNotPayment = async (req, res, next) => {
    const invoice = await Invoice.find({ status: false })
        .populate("ownerTable")
        .populate("detailInvoice");
    const arrayInvoice = invoice.map((item) => item.detailInvoice._id);
    const detailInvoice = await DetailInvoice.find({
        _id: { $in: arrayInvoice },
    }).populate("product._id");
    return res.status(200).json({ invoice, detailInvoice });
};
module.exports = { getInoiveNotPayment };
