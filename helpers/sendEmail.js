const nodemailer = require("nodemailer");
require("dotenv").config();

const { GMAIL_COM_PASSWORD } = process.env;

const nodemailerConfig = {
  host: "smtp.meta.ua",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: "maxkraft@meta.ua",
    pass: GMAIL_COM_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(nodemailerConfig);

const sendEmail = (verifyEmail) => {
  transporter
    .sendMail({ ...verifyEmail, from: '"Free" <maxkraft@meta.ua>' })
    .then(() => console.log("success"))
    .catch((error) => console.log(error));
};

module.exports = sendEmail;