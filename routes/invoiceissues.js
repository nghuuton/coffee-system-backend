const router = require("express-promise-router")();
const passport = require("passport");
const passportConfig = require("../middlewares/passport");

const invoiceIsuuesController = require("../controllers/invoiceissues");

router
    .route("/")
    .get(
        passport.authenticate("jwt", { session: false }),
        invoiceIsuuesController.getListInvoiceIssues
    )
    .post(
        passport.authenticate("jwt", { session: false }),
        invoiceIsuuesController.createNewInvoiceIssues
    );

router
    .route("/:id")
    .post(
        passport.authenticate("jwt", { session: false }),
        invoiceIsuuesController.importStore
    );

module.exports = router;
