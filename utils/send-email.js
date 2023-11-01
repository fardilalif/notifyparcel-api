const sendgrid = require('./sendgrid-config.js');

const sendEmail = async ({ from, to, subject, html }) =>
  await sendgrid.send({ from, to, subject, html });

module.exports = sendEmail;
