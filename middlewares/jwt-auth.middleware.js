import passport from "../config/passport.js";

const jwtAuthMiddleware = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, admin, info) => {
    if (err) {
      res.status(500).json({ message: "An error occurred", error: err });
    }
    if (!admin) {
      res.status(401).json({ message: "Unauthorized" });
    }
    req.admin = admin;
    next();
  })(req, res, next);
};

export default jwtAuthMiddleware;
