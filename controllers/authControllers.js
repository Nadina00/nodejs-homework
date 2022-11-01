const { User } = require("../db/usersModal");
const secret = `${process.env.SECRET}`;
require("dotenv").config();
const jwt = require("jsonwebtoken");
const passport = require("passport");

const registrationCont = async (req, res, next) => {
  const { userName, email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return res.status(409).json({
      status: "error",
      code: 409,
      message: "Email is already in use",
      data: "Conflict",
    });
  }
  try {
    const newUser = new User({ userName, email });
    newUser.setPassword(password);
    await newUser.save();
    res.status(201).json({
      status: "success",
      code: 201,
      data: {
        email,
        userName,
        message: "Registration successful",
      },
    });
  } catch (error) {
    next(error);
  }
};

const loginCont = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !user.validPassword(password)) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "Incorrect login or password",
      data: "Bad request",
    });
  }

  const payload = {
    id: user.id,
    userEmail: user.email,
  };
  const token = jwt.sign(payload, secret, { expiresIn: "1h" });
  await User.findByIdAndUpdate({ _id: user.id }, { token }, { new: true });

  console.log(user);
  res.json({
    status: "success",
    code: 200,
    data: {
      token,
    },
  });
};
const authMidlewar = (req, res, next) => {
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
const listCont = (req, res, next) => {
  const { userName } = req.user;
  res.json({
    status: "success",
    code: 200,
    data: {
      message: `Authorization was successful: ${userName}`,
    },
  });
};

const updateStatusSub = async (req, res, next) => {
  try {
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
    const userToken = jwt.decode(token, process.env.SECRET);
    const user = await User.findById(userToken.id);
    const { id } = req.params;
    const { subscription } = req.body;

    const results = await User.findByIdAndUpdate(
      { _id: id },
      { subscription },
      { new: true }
    );
    res.json({
      status: "success",
      code: 200,
      data: {
        user: results,
      },
    });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const logoutCont = async (req, res, next) => {
  try {
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
    const userToken = jwt.decode(token, process.env.SECRET);
    const user = await User.findById(userToken.id);
    if (token !== user.token) {
      return res.status(401).json({
        status: "error",
        code: 401,
        message: "Not authorized",
      });
    }
    console.log(user.token);
    user.token = null;
    console.log(user.token);
    await User.findByIdAndUpdate(
      { _id: user.id },
      { token: user.token },
      { new: true }
    );

    return res.json({
      status: "success",
      code: 204,
      data: {
        message: "No Content",
      },
    });
  } catch (err) {
    next(err.message);
  }
};

module.exports = {
  registrationCont,
  loginCont,
  listCont,
  authMidlewar,
  updateStatusSub,
  logoutCont,
};
