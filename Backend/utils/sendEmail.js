const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  var transport = nodemailer.createTransport({
    service: "Gmail",
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  // options
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  await transport.sendMail(mailOptions);
};
module.exports = sendEmail;
