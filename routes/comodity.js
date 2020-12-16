const router = require("express-promise-router")();
const passport = require("passport");
const passportConfig = require("../middlewares/passport");

const comodityController = require("../controllers/comodity");

router
    .route("/")
    .get(
        passport.authenticate("jwt", { session: false }),
        comodityController.getListComodity
    );

router
    .route("/:id")
    .post(
        passport.authenticate("jwt", { session: false }),
        comodityController.updateComodity
    )
    .delete(
        passport.authenticate("jwt", { session: false }),
        comodityController.removeComodity
    );

module.exports = router;
