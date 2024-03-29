const mailGenerator = require("./mailgen-config.js");
const sendEmail = require("./sendEmailNodemailer.js");

const sendArrivalEmail = async ({
  name,
  email,
  trackingNumber,
  parcelCode,
  color,
  size,
}) => {
  const html = {
    body: {
      name,
      intro: "Your parcel is ready",
      action: {
        instructions: "To see the parcel detail, click here:",
        button: {
          color: "#3b82f6", // Optional action button color
          text: parcelCode,
          link: `http://localhost:5173/tracking?trackingNumber=${trackingNumber}`,
        },
      },
      outro: `Color: ${color} Size: ${size}
      Tracking number: ${trackingNumber}`,
    },
  };

  const htmlEmail = mailGenerator.generate(html);

  await sendEmail({
    from: "muhdfardilalif@gmail.com",
    to: email,
    subject: "Parcel status",
    html: htmlEmail,
  });
};

module.exports = sendArrivalEmail;
