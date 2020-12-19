const Staff = require("../models/Staff");
const Account = require("../models/Account");

const getListStaff = async (req, res, next) => {
    const listStaff = await Staff.find({}).populate("account", ["email", "type"]);
    return res.status(200).json(listStaff);
};

const updateTypeUser = async (req, res, next) => {
    const { id, data } = req.body;
    const staff = await Staff.findById(id).populate("account");
    const account = await Account.findByIdAndUpdate(staff.account, {
        type: data ? data : staff.account.type,
    });
    const newStaff = await Staff.findById(id).populate("account", ["email", "type"]);
    return res.status(200).json(newStaff);
};

const createNewUser = async (req, res, next) => {
    const { firstname, lastname, sex, birthday, email, type, password } = req.body;
    const newAccount = new Account({ email, password, type });
    await newAccount.save();
    const newStaff = new Staff({
        firstname,
        lastname,
        birthday,
        sex,
        account: newAccount._id,
    });
    await newStaff.save();
    const result = await Staff.findById(newStaff._id).populate("account", [
        "email",
        "type",
    ]);
    return res.status(200).json(result);
};

const removeUser = async (req, res, next) => {
    const { id } = req.params;
    const staff = await Staff.findById(id);
    const account = await Account.findByIdAndRemove(staff.account);
    await Staff.findByIdAndRemove(id);
    return res.status(200).json({ success: true });
};

module.exports = { getListStaff, updateTypeUser, createNewUser, removeUser };
