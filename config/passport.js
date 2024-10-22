import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import Admin from "../models/admin.model.js";
import { getSecret } from './secrets.js';

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: getSecret(AUTH_SECRET_KEY, AUTH_SECRET_KEY_FILE)
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
