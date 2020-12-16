const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "_" + file.originalname);
    },
});

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === "image/jpgeg" ||
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "xls" ||
        file.mimetype === "xlsx"
    ) {
        cb(null, true);
    } else {
        cb(null, new Error("File must be in .jpgeg, .png, .jpg"));
    }
};

const upload = multer(
    { storage: storage, limits: { fileSize: 1024 * 1024 * 5 } },
    fileFilter
);

module.exports = upload;
