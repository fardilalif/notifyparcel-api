const sendEmail = require("./sendEmailNodemailer.js");

const sendCreatedEmail = async ({ name, email, trackingNumber }) => {
  const message = `<h3>Your parcel with tracking number ${trackingNumber} has been created</h3>`;

  await sendEmail({
    from: "muhdfardilalif@gmail.com",
    to: email,
    subject: "Parcel status",
    html: `<h2>Hello, ${name}</h2>${message}`,
  });
};

module.exports = sendCreatedEmail;
