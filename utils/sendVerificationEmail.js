const sendEmail = require("./send-email.js");

const sendVerificationEmail = async ({
  name,
  email,
  verificationToken,
  origin,
}) => {
  const verifyEmailLink = `${origin}/user/verify-email?token=${verificationToken}&email=${email}`;
  const message = `<p>Please confirm your email address by clicking the following link: <a href=${verifyEmailLink}>Verify email</a></p>`;

  await sendEmail({
    from: "muhdfardilalif@gmail.com",
    to: email,
    subject: "Email confirmation",
    html: `<h3>Hello, ${name}</h3>${message}`,
  });
};

module.exports = sendVerificationEmail;
