const Comodity = require("../models/Comodity");
const Supplier = require("../models/Supplier");
const ConvertionalUnit = require("../models/ConvertionalUnit");

const getListComodity = async (req, res, next) => {
    const listComodity = await Comodity.find({}).populate("bySupplier").populate("unit");
    return res.status(200).json(listComodity);
};

const updateComodity = async (req, res, next) => {
    const { unitId, name, unit, price, unitMath } = req.body;
    const { id } = req.params;
    if (unitId) {
        await ConvertionalUnit.findByIdAndUpdate(unitId, {
            unit: unit,
            unitMath: unitMath,
        });
        await Comodity.findByIdAndUpdate(id, {
            name,
            price,
        });
    } else {
        const newConver = new ConvertionalUnit({
            unit: unit.unit,
            unitMath: unit.unitMath,
        });
        await newConver.save();
        await Comodity.findByIdAndUpdate(id, {
            name,
            price,
            unit: newConver._id,
        });
    }

    const listComodity = await Comodity.find({}).populate("bySupplier").populate("unit");
    return res.status(200).json(listComodity);
};

const removeComodity = async (req, res, next) => {
    const { id } = req.params;
    await Comodity.findByIdAndRemove(id);
    return res.status(200).json({ success: true });
};

module.exports = {
    getListComodity,
    updateComodity,
    removeComodity,
};
