const router = require("express-promise-router")();
const passport = require("passport");
const passportConfig = require("../middlewares/passport");

const typeController = require("../controllers/type");

router
    .route("/")
    .get(passport.authenticate("jwt", { session: false }), typeController.getListType)
    .post(passport.authenticate("jwt", { session: false }), typeController.createType);

router
    .route("/:id")
    .post(passport.authenticate("jwt", { session: false }), typeController.updateType);

router
    .route("/remove/:id")
    .post(passport.authenticate("jwt", { session: false }), typeController.removeType);

module.exports = router;
