const router = require("express-promise-router")();
const passport = require("passport");
const passportConfig = require("../middlewares/passport");

const tableController = require("../controllers/table");

router
    .route("/:id")
    .post(
        passport.authenticate("jwt", { session: false }),
        tableController.updateStatusTable
    );

router
    .route("/")
    .get(passport.authenticate("jwt", { session: false }), tableController.getListTable)
    .post(
        passport.authenticate("jwt", { session: false }),
        tableController.getInvoiceTable
    );

router
    .route("/byStatus")
    .get(
        passport.authenticate("jwt", { session: false }),
        tableController.getTableNotPayment
    );

module.exports = router;
