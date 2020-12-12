const router = require("express-promise-router")();
const passport = require("passport");
const passportConfig = require("../middlewares/passport");

const productController = require("../controllers/product");

router
    .route("/")
    .get(
        passport.authenticate("jwt", { session: false }),
        productController.getListProduct
    );

module.exports = router;
