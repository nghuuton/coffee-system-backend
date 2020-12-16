const Type = require("../models/Type");
const Product = require("../models/Product");

const getListType = async (req, res, next) => {
    const listType = await Type.find({});
    return res.status(200).json({ listType });
};

const updateType = async (req, res, next) => {
    const { id } = req.params;
    const result = await Type.findByIdAndUpdate(
        id,
        { name: req.body.name },
        { new: true }
    );
    return res.status(200).json(result);
};

const createType = async (req, res, next) => {
    const newType = new Type(req.body);
    newType.save();
    return res.status(200).json(newType);
};

const removeType = async (req, res, next) => {
    const { id } = req.params;
    const products = await Product.find({ type: id });
    if (products.length > 0) {
        return res.status(200).json({ success: false });
    }
    await Type.findByIdAndRemove(id);
    return res.status(200).json({ success: true, id });
};

module.exports = { getListType, updateType, createType, removeType };
