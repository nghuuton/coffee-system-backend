const router = require("express-promise-router")();
const passport = require("passport");
const passportConfig = require("../middlewares/passport");

const accountController = require("../controllers/account");

router.post(
    "/login",
    passport.authenticate("local", { session: false }),
    accountController.login
);

router.post(
    "/auth",
    passport.authenticate("jwt", { session: false }),
    accountController.auth
);

router.post("/register", accountController.register);

module.exports = router;
