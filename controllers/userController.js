const User = require('../models/User.js');
const { StatusCodes } = require('http-status-codes');
const Error = require('../errors');
const {
  createTokenUser,
  attachCookiesToResponse,
  isTokenValid,
  checkPermission,
} = require('../utils');

const getAllUsers = async (req, res) => {
  const users = await User.find({ role: 'user' }).select('-password');
  res.status(StatusCodes.OK).json({ users, count: users.length });
};

const showMe = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

const updateUser = async (req, res) => {
  const { refreshToken } = req.signedCookies;

  const user = await User.findOneAndUpdate({ _id: req.user.userId }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    throw new Error.NotFoundError(`No user with id: ${req.user.userId}`);
  }

  const tokenUser = createTokenUser(user);
  const payload = isTokenValid({ token: refreshToken });

  attachCookiesToResponse({
    res,
    user: tokenUser,
    refreshToken: payload.refreshToken,
  });

  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new Error.BadRequestError(
      'Please provide old password and new password'
    );
  }

  const user = await User.findOne({ _id: req.user.userId });
  if (!user) {
    throw new Error.NotFoundError(`No user with id: ${req.user.userId}`);
  }

  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new Error.Unauthenticated('Invalid credentials');
  }

  user.password = newPassword;
  await user.save();
  res.status(StatusCodes.OK).json({ msg: 'password updated' });
};

const getSingleUser = async (req, res) => {
  const { id: userId } = req.params;

  const user = await User.findOne({ _id: userId }).select('-password');
  if (!user) {
    throw new Error.NotFoundError(`No user with id: ${userId}`);
  }

  checkPermission(req.user, userId);
  res.status(StatusCodes.OK).json({ user });
};

module.exports = {
  getAllUsers,
  showMe,
  updateUser,
  updateUserPassword,
  getSingleUser,
};
