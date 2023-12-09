const nodemailer = require("nodemailer");

const config = {
  service: "Gmail",
  auth: {
    user: process.env.NODEJS_GMAIL_APP_USER,
    pass: process.env.NODEJS_GMAIL_APP_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(config);

const sendEmail = async ({ from, to, subject, html }) => {
  let message = {
    from, // sender address
    to, // list of receivers
    subject, // Subject line
    html, // html body
  };
  await transporter.sendMail(message);
};

module.exports = sendEmail;
