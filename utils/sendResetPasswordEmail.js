const sendEmail = require('./send-email.js');

const sendResetPasswordEmail = async ({
  name,
  email,
  passwordToken,
  origin,
}) => {
  const resetURL = `${origin}/user/reset-password?token=${passwordToken}&email=${email}`;
  const message = `<h4>Hello ${name}</h4><p>Please reset your password by clicking on the following link: <a href='${resetURL}'>Reset Password</a></p>`;

  await sendEmail({
    to: email,
    from: 'muhdfardilalif@gmail.com',
    subject: 'Reset Password',
    html: message,
  });
};

module.exports = sendResetPasswordEmail;
