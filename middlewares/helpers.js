const Staff = require("../models/Staff");
const Invoice = require("../models/Invoice");

const totalPayment = (arrayPrice, arrayQuantity) => {
    let total = 0;
    for (let i = 0; i < arrayPrice.length; i++) {
        total += arrayPrice[i] * arrayQuantity[i];
    }
    return total;
};

const checkAccount = async (req, res, next) => {
    const { id } = req.params;
    const invoice = await Invoice.find({ createBy: id });
    if (invoice.length > 0) {
        req.body.status = 1;
        next();
    }
    if (invoice.length === 0) {
        req.body.status = 2;
        next();
    }
    // next();
};

module.exports = {
    checkAccount,
    totalPayment,
};
