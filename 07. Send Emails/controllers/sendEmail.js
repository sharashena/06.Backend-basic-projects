const nodemailer = require("nodemailer");
const sgMail = require("@sendgrid/mail");

const sendEmail = async (req, res) => {
  //   let testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "humberto28@ethereal.email",
      pass: "HMKDBpBDG6mwVkVHeF",
    },
  });

  let info = await transporter.sendMail({
    from: "Luka Sharashenidze <lsharashenidze2001@gmail.com>", // sender
    to: "bar@example.com", // receiver
    subject: "Hello World", // subject
    text: "hello wordl", // plain text body
    html: "<h2>Sending Emails with NodeJS</h2>", // html body
  });
  res.json(info);
};

// send emails with sendGrid

const sendEmail2 = async (req, res) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: "lsharashenidze2001@gmail.com",
    from: "lsharashenidze2001@gmail.com",
    subject: "Sending with sendgrid is fun",
    text: "text from nodeJS",
    html: "<strong>strong text</strong>",
  };

  const info = await sgMail.send(msg);
  res.json(info);
};

module.exports = sendEmail;
