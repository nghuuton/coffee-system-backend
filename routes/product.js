const router = require("express-promise-router")();
const passport = require("passport");
const passportConfig = require("../middlewares/passport");

const productController = require("../controllers/product");
const upload = require("../middlewares/uploadFile");
const { authenticate } = require("passport");

router
    .route("/uploadFile")
    .post(
        passport.authenticate("jwt", { session: false }),
        upload.single("xls"),
        productController.importExcel
    );

router
    .route("/")
    .get(
        passport.authenticate("jwt", { session: false }),
        productController.getListProduct
    )
    .post(
        passport.authenticate("jwt", { session: false }),
        upload.single("image"),
        productController.createProduct
    );

router
    .route("/:id")
    .get(
        passport.authenticate("jwt", { session: false }),
        productController.getInformation
    )
    .post(
        passport.authenticate("jwt", { session: false }),
        upload.single("image"),
        productController.updateProduct
    );

router
    .route("/remove/:id")
    .post(
        passport.authenticate("jwt", { session: false }),
        productController.removeProduct
    );

module.exports = router;
