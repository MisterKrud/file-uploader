import bcrypt from "bcryptjs";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import db from "../db/queries"


passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const user = await db.getUser(username);
                if(!user) {
                    return done(null, false, {message: "No such user"})
                }
            const match = await bcrypt.compare(password, user.password);
                if(!match) {
                    return done(null, false, {message: "Incorrect password"})
                }
            console.log("login success")
            return done(null, user);
        } catch(err) {
            return done(err)
        }
    })
)

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await db.getUserById(id);
        done(null, user);
    } catch(err) {
        done(err)
    }
});

export default passport;