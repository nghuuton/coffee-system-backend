const router = require("express-promise-router")();
const passport = require("passport");
const passportConfig = require("../middlewares/passport");

const staffController = require("../controllers/staff");

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
    .post(passport.authenticate("jwt", { session: false }), staffController.removeUser);

module.exports = router;
