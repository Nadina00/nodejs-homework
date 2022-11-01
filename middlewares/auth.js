const passport = require("passport");

const authMidlewar = (req, res, next) => {
  console.log(req.body);

  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (!user || err) {
      console.log(user);
      return res.status(401).json({
        status: "error",
        code: 401,
        message: "Unauthorized",
        data: "Unauthorized",
      });
    }
    req.user = user;
    next();
  })(req, res, next);
};
module.exports = {
  authMidlewar,
};
