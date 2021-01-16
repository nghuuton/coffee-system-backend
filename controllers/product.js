const Product = require("../models/Product");
const Type = require("../models/Type");
const ConvertionalUnit = require("../models/ConvertionalUnit");
const DetailInvoice = require("../models/Detail_Invoice");
const Comodity = require("../models/Comodity");
const fs = require("fs");
const XLSX = require("xlsx");

const getListProduct = async (req, res, next) => {
  const perPage = 12;
  const { page } = req.query;
  const start = (page - 1) * perPage;
  const end = page * perPage;
  const products = await Product.find({})
    .populate("type")
    .populate("comoditys");
  const result = products.slice(start, end);
  return res.status(200).json({ result, length: products.length });
};

const getAllProduct = async (req, res, next) => {
  const result = await Product.find({}).populate("type").populate("comoditys");
  return res.status(200).json(result);
};

const getInformation = async (req, res, next) => {
  const { id } = req.params;
  const result = await Product.findById(id)
    .populate("type")
    .populate("comoditys");
  return res.status(200).json(result);
};

const createProduct = async (req, res, next) => {
  const { name, price, comoditys, type } = req.body;
  const newComodity = comoditys.split(",");
  const newProduct = new Product({
    name,
    price,
    comoditys: newComodity,
    type,
    image: req.file ? `coffee-sytem.herokuapp.com/${req.file.path}` : "",
  });
  await newProduct.save();
  const result = await Product.findById(newProduct._id)
    .populate("type")
    .populate("comoditys");
  return res.status(200).json(result);
};

const updateProduct = async (req, res, next) => {
  const { id } = req.params;
  const { name, price, comoditys, type } = req.body;
  const product = await Product.findById(id);
  const result = await Product.findByIdAndUpdate(
    id,
    {
      name: name,
      price: Number(price),
      type: type,
      comoditys: comoditys.split(","),
      image: req.file
        ? `coffee-sytem.herokuapp.com${req.file.path}`
        : product.image,
    },
    { new: true }
  )
    .populate("type")
    .populate("comoditys");
  return res.status(200).json(result);
};

const removeProduct = async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (product) {
    const detailInvoice = await DetailInvoice.find({
      "product._id": { $in: product._id },
    });
    if (detailInvoice.length > 0)
      return res.status(200).json({ success: false });
    if (detailInvoice.length === 0) {
      if (product.image) {
        const url =
          product.image && product.image.split("coffee-sytem.herokuapp.com");
        fs.unlinkSync(`.${url[1]}`);
      }
      const result = await Product.findByIdAndRemove(id);
      return res.status(200).json({ success: true });
    }
  }
};

const importExcel = async (req, res, next) => {
  const woorkBook = XLSX.readFile(req.file.path);
  const sheet_name_list = woorkBook.SheetNames;
  const data = XLSX.utils.sheet_to_json(woorkBook.Sheets[sheet_name_list[0]]);
  for (const item of data) {
    const type = await Type.findOne({ name: item["Loại"] }).select("_id");
    const comoditys = await Comodity.find({
      name: { $in: [...item["Hàng hoá"].split(", ")] },
    }).select("_id");
    const newProduct = new Product({
      name: item["Tên món"],
      price: item["Đơn giá"],
      type,
      comoditys,
    });
    newProduct.save();
  }
  setTimeout(async () => {
    const result = await Product.find({})
      .populate("type")
      .populate("comoditys");
    fs.unlinkSync(req.file.path);
    return res.status(200).json(result);
  }, 1000);
};

module.exports = {
  createProduct,
  getListProduct,
  updateProduct,
  getInformation,
  removeProduct,
  importExcel,
  getAllProduct,
};
