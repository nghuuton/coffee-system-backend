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

const getChartInvoice = async (req, res, next) => {
    const { start, end } = req.body;
    const invoice = await Invoice.find({
        createdAt: {
            $gte: start ? new Date(start) : new Date(2020, 10, 30),
            $lte: end ? new Date(end) : new Date(2090, 10, 30),
        },
    }).populate("detailInvoice");
    return res.status(200).json(invoice);
};

module.exports = { getInoiveNotPayment, getChartInvoice };
