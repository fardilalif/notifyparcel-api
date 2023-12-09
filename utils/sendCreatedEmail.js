const sendEmail = require("./sendEmailNodemailer.js");

const sendCreatedEmail = async ({ name, email, trackingNumber }) => {
  const message = `<p>Your parcel with tracking number: ${trackingNumber} has been created</p>`;

  await sendEmail({
    from: "muhdfardilalif@gmail.com",
    to: email,
    subject: "Parcel status",
    html: `<h2>Hello, ${name}</h2>${message}`,
  });
};

module.exports = sendCreatedEmail;
