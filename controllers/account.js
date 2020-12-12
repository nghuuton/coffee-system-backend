require("dotenv").config();
const Account = require("../models/Account");
const JWT = require("jsonwebtoken");

const generateToken = (id) => {
    const token = JWT.sign(
        {
            iss: "Coffee System",
            sub: id,
        },
        process.env.SECRET,
        {
            expiresIn: "1day",
        }
    );
    return token;
};

const login = async (req, res, next) => {
    const token = await generateToken(req.user.account._id);
    res.setHeader("Authorization", token);
    return res.status(200).json({ success: true, token });
};

const register = async (req, res, next) => {
    const newAccount = new Account(req.body);
    await newAccount.save();
    const token = await generateToken(newAccount._id);
    res.setHeader("Authorization", token);
    return res.status(200).json({ success: true, token });
};

const auth = async (req, res, next) => {
    return res.status(200).json(req.user);
};

module.exports = {
    auth,
    login,
    register,
};
