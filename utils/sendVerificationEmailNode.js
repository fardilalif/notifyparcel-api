const sendEmail = require("./sendEmailNodemailer.js");

const sendVerificationEmailNode = async ({
  name,
  email,
  verificationToken,
  origin,
}) => {
  const verifyEmailLink = `${origin}/verifyAccount?verificationToken=${verificationToken}&email=${email}`;
  console.log(verifyEmailLink);
  const message = `<h3>Please confirm your email address by clicking the following link: <a href=${verifyEmailLink}>Verify email</a></h3>`;

  await sendEmail({
    from: "muhdfardilalif@gmail.com",
    to: email,
    subject: "Email confirmation",
    html: `<h2>Hello, ${name}</h2>${message}`,
  });
};

module.exports = sendVerificationEmailNode;
