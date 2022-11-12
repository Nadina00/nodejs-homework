const { User } = require("../db/usersModal");
const secret = `${process.env.SECRET}`;
require("dotenv").config();
const jwt = require("jsonwebtoken");
const fs = require("fs/promises");
const path = require("path");
const gravatar = require("gravatar");
const Jimp = require("jimp");
const sgMail = require("@sendgrid/mail");
const { v4: uuidv4 } = require("uuid");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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
    const avatarURL = gravatar.url(email);
    const verificationToken = uuidv4();
    const newUser = new User({ userName, email, avatarURL, verificationToken });
    newUser.setPassword(password);
    await newUser.save();

    const msg = {
      to: email,
      from: email,
      subject: "Thank you for registration",
      text: "Wellcame in our website",
      html: `Wellcame in our website <a href="http://localhost:3000/api/users/verify/${verificationToken}">please confirm your email adress </a>`,
    };
    await sgMail.send(msg);

    res.status(201).json({
      status: "success",
      code: 201,
      data: {
        email,
        userName,
        avatarURL,
        message: "Registration successful",
      },
    });
  } catch (error) {
    next(error);
  }
};



const verificationCont = async (req, res, next) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "Not found",
      data: "Bad request",
    });
  }
  try {
    if (!user.verificationToken) {
      return res.status(401).json({
        status: "error",
        code: 401,
        message: "Not found",
        data: "Bad request",
      });
    }
    await User.findByIdAndUpdate(
      { _id: user.id },
      { verificationToken: null, verify: true },
      { new: true }
    );

    return res.json({
      status: "success",
      code: 200,
      message: 'Verification successful'
    });
  } catch (error) {
    next(error);
  }
};

const verifyCont = async (req, res, next) => {

  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "missing required field email",
      data: "Bad request",
    });
  }
  try {
    const user = await User.findOne({ email });
    console.log(user);
    if (!user.verify) {
      console.log(user.verificationToken);
      const msg = {
        to: email,
        from: email,
        subject: "Thank you for registration",
        html: `Wellcame in our website <a href="http://localhost:3000/api/users/verify/${user.verificationToken}">please confirm your email adress </a>`,
      };
      await sgMail.send(msg);

      return res.status(201).json({
        status: "success",
        code: 201,
        message: "Verification email sent"
      });
    }
  } catch (error) {
    next(
      res.status(400).json({
        status: "error",
        code: 400,
        message: "Verification has already been passed",
        data: "Bad request",
      })
    );
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
  if (!user.verify) {
    return res.status(401).json({
      status: "error",
      code: 401,
      message: "user not verification",
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
    const { subscription, email } = req.user;

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

const userAvatar = async (req, res, next) => {
  const { path: tmpUpload, originalname } = req.file;
  const { _id: id } = req.user;
  const imageName = `${id}_${originalname}`;
  try {
    const resultUpload = path.join(
      __dirname,
      "../",
      "public",
      "avatars",
      imageName
    );
    const img = await Jimp.read(tmpUpload);
    await img
      .autocrop()
      .cover(
        250,
        250,
        Jimp.HORIZONTAL_ALIGN_CENTER || Jimp.VERTICAL_ALIGN_MIDDLE
      )
      .writeAsync(tmpUpload);
    await fs.rename(tmpUpload, resultUpload);
    const avatarURL = path.join("public", "avatars", imageName);
    await User.findByIdAndUpdate(req.user.id, { avatarURL });

    res.status(201).json({
      status: "success",
      code: 201,
      data: {
        avatarURL,
      },
    });
  } catch (error) {
    await fs.unlink(tmpUpload);
    next(error.message);
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
  userAvatar,
  logoutCont,
  verificationCont,
  verifyCont,
};
