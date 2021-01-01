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
    })
        .populate("detailInvoice")
        .sort([["createdAt", "ASC"]]);
    return res.status(200).json(invoice);
};

const getListInvoice = async (req, res, next) => {
    const listInvoice = await Invoice.find({})
        .populate("detailInvoice")
        .populate("createBy")
        .populate("ownerTable")
        .sort([["createdAt", "desc"]]);
    const listDetailInvoice = await DetailInvoice.find({}).populate("product._id");
    return res.status(200).json({ listInvoice, listDetailInvoice });
};

const removeInvoice = async (req, res, next) => {
    const { id } = req.params;
    const invoice = await Invoice.findById(id);
    await DetailInvoice.findByIdAndRemove(invoice.detailInvoice);
    await Invoice.findByIdAndRemove(id);
    const listInvoice = await Invoice.find({})
        .populate("detailInvoice")
        .populate("createBy")
        .populate("ownerTable")
        .sort([["createdAt", "desc"]]);
    const listDetailInvoice = await DetailInvoice.find({}).populate("product._id");
    return res.status(200).json({ listInvoice, listDetailInvoice });
};

module.exports = { getInoiveNotPayment, getChartInvoice, getListInvoice, removeInvoice };
