const { Schema, model } = require("mongoose");
const bycrypt = require("bcryptjs");

const accountSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    status: {
        type: Number,
        default: 0,
    },
    type: {
        type: Number,
        required: true,
    },
});

accountSchema.pre("save", async function (next) {
    try {
        const salt = await bycrypt.genSalt(10);
        const newPassword = await bycrypt.hash(this.password, salt);
        this.password = newPassword;
        next();
    } catch (error) {
        next(error);
    }
});

accountSchema.methods.comparePassword = async function (userPassword) {
    try {
        const result = await bycrypt.compare(userPassword, this.password);
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

const Account = model("Account", accountSchema);
module.exports = Account;
