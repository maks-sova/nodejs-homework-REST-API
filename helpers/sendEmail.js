const nodemailer = require("nodemailer");
require("dotenv").config();

const { GMAIL_COM_PASSWORD } = process.env;

const nodemailerConfig = {
  host: "smtp.ukr.net",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: "maxxxhill2k@gmail.com",
    pass: GMAIL_COM_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(nodemailerConfig);

const sendEmail = (verifyEmail) => {
  transporter
    .sendMail({ ...verifyEmail, from: '"Fred Foo 👻" <maxxxhill2k@gmail.com>' })
    .then(() => console.log("success"))
    .catch((error) => console.log(error));
};

module.exports = sendEmail;