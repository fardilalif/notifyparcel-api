const Token = require('../models/Token.js');
const { isTokenValid, attachCookiesToResponse } = require('../utils');
const Error = require('../errors');

const authenticateUser = async (req, res, next) => {
  const { accessToken, refreshToken } = req.signedCookies;

  try {
    if (accessToken) {
      const payload = isTokenValid({ token: accessToken });
      req.user = payload;
      return next();
    }
    const payload = isTokenValid({ token: refreshToken });
    const existingToken = await Token.findOne({
      user: payload.user.userId,
    });

    if (!existingToken || !existingToken.isValid) {
      throw new Error.Unauthenticated('authentication invalid');
    }

    attachCookiesToResponse({
      res,
      user: payload.user,
      refreshToken: payload.refreshToken,
    });

    req.user = payload.user;
    next();
  } catch (error) {
    throw new Error.Unauthenticated('authentication invalid');
  }
};

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new Error.Unauthorized('unauthorized to access this route');
    }
    next();
  };
};

module.exports = { authenticateUser, authorizePermissions };
