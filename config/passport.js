import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import Admin from "./models/Admin";

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.AUTH_SECRET,
    },
    (jwtPayload, done) => {
      Admin.findByPk(jwtPayload.id)
        .then((admin) => {
          if (admin) {
            return done(null, admin);
          } else {
            return done(null, false);
          }
        })
        .catch((err) => done(err, false));
    }
  )
);

export default passport;
