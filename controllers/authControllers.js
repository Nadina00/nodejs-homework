const { User } = require("../db/usersModal");
const secret = `${process.env.SECRET}`;
require("dotenv").config();
const jwt = require("jsonwebtoken");

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

  res.json({
    status: "success",
    code: 200,
    data: {
      token,
    },
  });
};

const updateStatusSub = async (req, res, next) => {
  try {
    const { subscription } = req.body;
    const results = await User.findByIdAndUpdate(
      { _id: req.user.id },
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

const currentUser = async (req, res, next) => {
  try {
    const { email } = req.body;
    const { subscription } = req.user;

    res.json({
      status: "success",
      code: 200,
      data: {
        email,
        subscription,
      },
    });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const logoutCont = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(
      { _id: req.user.id },
      { token: null },
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
  updateStatusSub,
  currentUser,
  logoutCont,
};
