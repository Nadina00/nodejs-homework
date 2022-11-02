const jwt = require("jsonwebtoken");
const { User } = require("../db/usersModal");

const tokenMidleware = async (req, res, next) => {
  const [, token] = req.headers.authorization.split(" ");
  if (!token) {
    next(
      res.status(401).json({
        status: "error",
        code: 401,
        message: "Not authorized",
      })
    );
  }
  try {
    const userToken = jwt.decode(token, process.env.SECRET);
    const user = await User.findById(userToken.id);
    if (token !== user.token) {
      next(
        res.status(401).json({
          status: "error",
          code: 401,
          message: "Not authorized",
        })
      );
    }
    req.token = token;
    req.user = user;
    next();
  } catch (err) {
    console.log(err.message);
  }
};
module.exports = {
  tokenMidleware,
};
