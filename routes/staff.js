const router = require("express-promise-router")();
const passport = require("passport");
const passportConfig = require("../middlewares/passport");

const staffController = require("../controllers/staff");

const heplers = require("../middlewares/helpers");

router
    .route("/")
    .get(passport.authenticate("jwt", { session: false }), staffController.getListStaff)
    .post(
        passport.authenticate("jwt", { session: false }),
        staffController.updateTypeUser
    );
router
    .route("/newuser")
    .post(
        passport.authenticate("jwt", { session: false }),
        staffController.createNewUser
    );

router
    .route("/:id")
    .post(
        passport.authenticate("jwt", { session: false }),
        heplers.checkAccount,
        staffController.removeUser
    );

router
    .route("/updateStatus/:id")
    .post(passport.authenticate("jwt", { session: false }), staffController.updateStatus);

module.exports = router;
