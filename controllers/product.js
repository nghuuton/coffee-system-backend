const Product = require("../models/Product");
const Type = require("../models/Type");

const getListProduct = async (req, res, next) => {
    const result = await Product.find({});
    return res.status(200).json(result);
};

module.exports = {
    getListProduct,
};
