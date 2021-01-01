const router = require("express-promise-router")();
const passport = require("passport");
const passportConfig = require("../middlewares/passport");

const invoiceController = require("../controllers/invoice");

router
    .route("/getChart")
    .post(
        passport.authenticate("jwt", { session: false }),
        invoiceController.getChartInvoice
    );

router
    .route("/")
    .get(
        passport.authenticate("jwt", { session: false }),
        invoiceController.getListInvoice
    );

router
    .route("/:id")
    .post(
        passport.authenticate("jwt", { session: false }),
        invoiceController.removeInvoice
    );

router
    .route("/notpayment")
    .get(
        passport.authenticate("jwt", { session: false }),
        invoiceController.getInoiveNotPayment
    );

module.exports = router;
