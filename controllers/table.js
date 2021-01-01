const Table = require("../models/Table");
const Invoice = require("../models/Invoice");
const Staff = require("../models/Staff");
const DetailInvoice = require("../models/Detail_Invoice");
const Product = require("../models/Product");

const getListTable = async (req, res, next) => {
    let sortBy = req.query.order ? req.query.sortBy : "name";
    let limit = req.query.limit ? parseInt(req.query.limit) : 20;
    let skip = req.query.skip ? parseInt(req.query.skip) : 0;
    let byStatus = req.query.byStatus ? req.query.byStatus : { $ne: null };
    const tables = await Table.find({ status: byStatus }).skip(skip).limit(limit);
    return res.status(200).json(tables);
};

const getInvoiceTable = async (req, res, next) => {
    const { _id } = req.body;
    const result = await Invoice.findOne({ status: false, ownerTable: { $in: _id } })
        .populate("ownerTable")
        .exec();
    if (result) {
        const detailInvoice = await DetailInvoice.findById(result.detailInvoice).populate(
            "product._id"
        );
        return res.status(200).json({ result, detailInvoice });
    }
    return res.status(200).json({ success: true });
};

const getTableNotPayment = async (req, res, next) => {
    const invoice = await Invoice.find({ status: false })
        .populate("ownerTable")
        .populate("createBy");
    const result = invoice.map((item) => item.ownerTable);
    return res.status(200).json(result);
};

module.exports = {
    getListTable,
    getInvoiceTable,
    getTableNotPayment,
};
