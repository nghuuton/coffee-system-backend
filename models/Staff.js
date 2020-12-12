const { Schema, model } = require("mongoose");

const staffSchema = new Schema({
    firstname: {
        type: String,
        maxlength: 20,
        required: true,
    },
    lastname: {
        type: String,
        maxlength: 10,
        required: true,
    },
    birthday: {
        type: Schema.Types.Date,
        required: true,
    },
    sex: {
        type: Schema.Types.Boolean,
        default: true,
        required: true,
    },
    account: {
        type: Schema.Types.ObjectId,
        ref: "Account",
        unique: true,
        required: true,
    },
});

const Staff = model("Staff", staffSchema);
module.exports = Staff;
