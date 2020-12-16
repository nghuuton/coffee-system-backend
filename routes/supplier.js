const router = require("express-promise-router")();
const passport = require("passport");
const passportConfig = require("../middlewares/passport");

const supplierController = require("../controllers/supplier");

router
    .route("/")
    .get(
        passport.authenticate("jwt", { session: false }),
        supplierController.getListSupplier
    )
    .post(
        passport.authenticate("jwt", { session: false }),
        supplierController.createSupplier
    );

router
    .route("/:id")
    .post(
        passport.authenticate("jwt", { session: false }),
        supplierController.updateSupplier
    )
    .delete(
        passport.authenticate("jwt", { session: false }),
        supplierController.removeSupplier
    );

module.exports = router;
