const Mailgen = require("mailgen");

const mailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "NotifyParcel",
    link: "app.notifyparcel.site",
  },
});

module.exports = mailGenerator;
