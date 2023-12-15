const sendEmail = require("./sendEmailNodemailer.js");
const mailGenerator = require("./mailgen-config.js");

const sendVerificationEmailNode = async ({
  name,
  email,
  verificationToken,
  origin,
}) => {
  const verifyEmailLink = `${origin}/verifyAccount?verificationToken=${verificationToken}&email=${email}`;

  const html = {
    body: {
      name,
      intro: "Account verification",
      action: {
        instructions: "To verify your account, click here:",
        button: {
          color: "#3b82f6", // Optional action button color
          text: "Verify account",
          link: verifyEmailLink,
        },
      },
    },
  };

  const htmlEmail = mailGenerator.generate(html);

  await sendEmail({
    from: "muhdfardilalif@gmail.com",
    to: email,
    subject: "Email confirmation",
    html: htmlEmail,
  });
};

module.exports = sendVerificationEmailNode;
