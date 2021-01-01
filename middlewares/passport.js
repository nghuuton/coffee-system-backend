const passport = require("passport");

// * Strategy Jsonwebtoken
const JWTStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");

// * Strategy Local (Username && Password)
const LocalStrategy = require("passport-local").Strategy;
const Account = require("../models/Account");
const Staff = require("../models/Staff");

require("dotenv").config();

passport.use(
    new JWTStrategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken("Authorization"),
            secretOrKey: process.env.SECRET,
        },
        async (payload, done) => {
            try {
                const account = await Account.findById(payload.sub);
                if (!account) {
                    return done(null, false);
                }
                const staff = await Staff.findOne({ account: account._id }).populate(
                    "account",
                    "type"
                );
                return done(null, { staff, loginSuccess: true });
            } catch (error) {
                done(error, false);
            }
        }
    )
);

passport.use(
    new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
        try {
            const account = await Account.findOne({ email });
            console.log(email, password);
            const result = await account.comparePassword(password);
            if (!account) done(null, false);
            if (!result) done(null, false);
            if (account) {
                if (account.status === 1) return done(null, false);
                const staff = await Staff.findOne({ account: account._id }).populate(
                    "account",
                    "type"
                );
                done(null, staff);
            }
        } catch (error) {
            done(error, false);
        }
    })
);
