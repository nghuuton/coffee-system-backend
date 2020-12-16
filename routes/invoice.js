const router = require("express-promise-router")();
const passport = require("passport");
const passportConfig = require("../middlewares/passport");

const invoiceController = require("../controllers/invoice");

router
    .route("/notpayment")
    .get(
        passport.authenticate("jwt", { session: false }),
        invoiceController.getInoiveNotPayment
    );

router
    .route("/getChart")
    .post(
        passport.authenticate("jwt", { session: false }),
        invoiceController.getChartInvoice
    );

module.exports = router;
