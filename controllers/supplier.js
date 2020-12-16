const Supplier = require("../models/Supplier");

const getListSupplier = async (req, res, next) => {
    const result = await Supplier.find({});
    return res.status(200).json(result);
};

const createSupplier = async (req, res, next) => {
    const newSupplier = new Supplier(req.body);
    await newSupplier.save();
    return res.status(200).json(newSupplier);
};

const updateSupplier = async (req, res, next) => {
    const { id } = req.params;
    const result = await Supplier.findByIdAndUpdate(id, req.body, { new: true });
    return res.status(200).json(result);
};

const removeSupplier = async (req, res, next) => {
    const { id } = req.params;
    await Supplier.findByIdAndRemove(id);
    return res.status(200).json({ success: true });
};

module.exports = { getListSupplier, createSupplier, updateSupplier, removeSupplier };
