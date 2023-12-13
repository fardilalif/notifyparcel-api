const User = require("../models/User.js");
const Token = require("../models/Token.js");
const { StatusCodes } = require("http-status-codes");
const Error = require("../errors");
const crypto = require("crypto");
const util = require("util");
const {
  sendVerificationEmail,
  sendVerificationEmailNode,
  sendResetPasswordEmail,
  createTokenUser,
  attachCookiesToResponse,
  createHash,
} = require("../utils");

const register = async (req, res) => {
  const { email, name, password, studentNumber } = req.body;

  const emailExists = await User.findOne({ email });
  if (emailExists) {
    throw new Error.BadRequestError("email already exists");
  }

  const isFirstAccount = (await User.countDocuments()) === 0;
  const role = isFirstAccount ? "admin" : "user";

  const randomBytes = util.promisify(crypto.randomBytes);
  const verificationToken = (await randomBytes(30)).toString("hex");

  const user = await User.create({
    name,
    email,
    studentNumber,
    password,
    role,
    verificationToken,
  });

  const origin = "http://localhost:5173";

  await sendVerificationEmailNode({
    name: user.name,
    email: user.email,
    verificationToken: user.verificationToken,
    origin,
  });

  res
    .status(StatusCodes.CREATED)
    .json({ msg: "Success! Please check your email for verification" });
};

const verifyEmail = async (req, res) => {
  const { verificationToken, email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error.NotFoundError("verification failed");
  }

  if (user.verificationToken !== verificationToken) {
    throw new Error.Unauthenticated("verification failed");
  }

  user.isVerified = true;
  user.verifiedDate = new Date();
  user.verificationToken = "";

  await user.save();

  res.status(StatusCodes.OK).json({ msg: "email verified" });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new Error.BadRequestError("please provide email and password");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error.Unauthenticated("invalid credential");
  }

  const isMatched = await user.comparePassword(password);
  if (!isMatched) {
    throw new Error.Unauthenticated("invalid credential");
  }

  if (!user.isVerified) {
    throw new Error.Unauthenticated("please verify your account");
  }

  const tokenUser = createTokenUser(user);
  let refreshToken = "";

  const existingToken = await Token.findOne({ user: user._id });
  if (existingToken) {
    if (!existingToken.isValid) {
      throw new Error.Unauthenticated("invalid credential");
    }

    refreshToken = existingToken.refreshToken;
    attachCookiesToResponse({ res, user: tokenUser, refreshToken });

    res.status(StatusCodes.OK).json({ user: tokenUser });
    return;
  }

  const randomBytes = util.promisify(crypto.randomBytes);
  refreshToken = (await randomBytes(40)).toString("hex");
  await Token.create({ refreshToken, user: user._id });

  attachCookiesToResponse({ res, user: tokenUser, refreshToken });

  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const logout = async (req, res) => {
  // Delete the user token in Token collection
  // await Token.findOneAndDelete({ user: req.user.userId });

  res.cookie("accessToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.cookie("refreshToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.status(StatusCodes.OK).json({ msg: "user logged out" });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new Error.BadRequestError("please provide email");
  }

  const user = await User.findOne({ email });
  if (user) {
    const randomBytes = util.promisify(crypto.randomBytes);
    const passwordToken = (await randomBytes(40)).toString("hex");
    const origin = "http://localhost:3000";
    // call sendResetPasswordEmail
    await sendResetPasswordEmail({
      name: user.name,
      email: user.email,
      passwordToken: passwordToken,
      origin,
    });

    const tenMinutes = 1000 * 60 * 10;
    const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);

    user.passwordToken = createHash(passwordToken);
    user.passwordTokenExpirationDate = passwordTokenExpirationDate;
    await user.save();
  }

  res
    .status(StatusCodes.OK)
    .json({ msg: "please check your email for reset password link" });
};

const resetPassword = async (req, res) => {
  const { token, email, password } = req.body;

  if (!token || !email || !password) {
    throw new Error.BadRequestError("please provide all values");
  }

  const user = await User.findOne({ email });
  if (user) {
    const currentDate = new Date();

    if (
      user.passwordToken === createHash(token) &&
      user.passwordTokenExpirationDate > currentDate
    ) {
      user.password = password;
      user.passwordToken = null;
      user.passwordTokenExpirationDate = null;
      await user.save();
    }
  }

  res.status(StatusCodes.OK).json({ msg: "password reset" });
};

module.exports = {
  register,
  verifyEmail,
  login,
  logout,
  forgotPassword,
  resetPassword,
};
