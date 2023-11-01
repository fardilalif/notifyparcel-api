const sendEmail = require('./send-email.js');
const sendVerificationEmail = require('./sendVerificationEmail.js');
const createTokenUser = require('./createTokenUser.js');
const {
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
} = require('./jwt.js');
const createHash = require('./createHash.js');
const sendResetPasswordEmail = require('./sendResetPasswordEmail.js');
const checkPermission = require('./checkPermission.js');
module.exports = {
  sendEmail,
  sendVerificationEmail,
  sendResetPasswordEmail,
  createTokenUser,
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
  createHash,
  checkPermission,
};
