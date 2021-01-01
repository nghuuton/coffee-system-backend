const InvoiceIssues = require("../models/Invoice_Issue");
const Supplier = require("../models/Supplier");
const Staff = require("../models/Staff");
const Comodity = require("../models/Comodity");
const heplers = require("../middlewares/helpers");

const getListInvoiceIssues = async (req, res, next) => {
    const listInvoiceIssues = await InvoiceIssues.find({})
        .populate("byStaff")
        .populate("bySupplier")
        .populate("comoditys._id")
        .sort([["createdAt", "desc"]]);
    return res.status(200).json(listInvoiceIssues);
};

const createNewInvoiceIssues = async (req, res, next) => {
    const { byStaff, bySupplier, comoditys, price, quantity } = req.body;
    const supplier = await Supplier.findOne({ name: bySupplier });
    let newSupplier = null;
    if (!supplier) {
        newSupplier = new Supplier({ name: bySupplier });
        await newSupplier.save();
    }

    const newComoditys = [];

    for (let index = 0; index < comoditys.length; index++) {
        const comodity = await Comodity.findOne({ name: comoditys[index] });
        if (!comodity) {
            const newComodity = new Comodity({
                name: comoditys[index],
                price: price[index],
                bySupplier: supplier ? supplier._id : newSupplier._id,
            });
            newComodity.save();
            newComoditys.push({ _id: newComodity._id, quantity: quantity[index] });
        } else {
            newComoditys.push({ _id: comodity._id, quantity: quantity[index] });
        }
    }
    const newInvoiceIssues = new InvoiceIssues({
        totalPayment: heplers.totalPayment(price, quantity),
        comoditys: newComoditys,
        bySupplier: supplier ? supplier._id : newSupplier._id,
        byStaff,
    });
    await newInvoiceIssues.save();
    const listComodity = await Comodity.find({}).populate("bySupplier").populate("unit");
    const listSupplier = await Supplier.find({});
    const listInvoiceIssues = await InvoiceIssues.find({})
        .populate("byStaff")
        .populate("bySupplier")
        .populate("comoditys._id")
        .sort([["createdAt", "desc"]]);
    return res.status(200).json({ listInvoiceIssues, listComodity, listSupplier });
};

const importStore = async (req, res, next) => {
    const { id } = req.params;
    const invoiceIssues = await InvoiceIssues.findById(id)
        .populate("byStaff")
        .populate("bySupplier")
        .populate("comoditys._id");
    for (const item of invoiceIssues.comoditys) {
        await Comodity.findByIdAndUpdate(item._id._id, {
            $inc: { quantity: item.quantity },
        });
    }
    invoiceIssues.status = true;
    invoiceIssues.save();

    const listComodity = await Comodity.find({}).populate("bySupplier").populate("unit");
    return res.status(200).json({ id: invoiceIssues._id, listComodity });
};

module.exports = {
    importStore,
    createNewInvoiceIssues,
    getListInvoiceIssues,
};
