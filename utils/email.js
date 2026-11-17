const nodemailer = require('nodemailer');
const keys = require('../config/dev');

const sendEmail = async (options) => {
  // create transporter
  const transporter = nodemailer.createTransport({
    /*
    service: 'Gmail',
    auth: {
      user: keys.EMAIL_USERNAME,
      pass: keys.EMAIL_PASSWORD,
    },

    // activate less secure app option
    */
    host: keys.EMAIL_HOST,
    port: keys.EMAIL_PORT,
    secure: false,
    logger: false,
    connectionTimeout: 10000,
    auth: {
      user: keys.EMAIL_USERNAME,
      pass: keys.EMAIL_PASSWORD,
    },
  });

  // define email options
  const mailOptions = {
    from: 'Hello <hello@inbound-mailtrap.io>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // send email, async function returns promise
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
