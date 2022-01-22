// use nodemailer to send mails
//  npm i nodemailer

const nodemailer = require("nodemailer");
const config = process.env // || require('../secrets')
// async..await is not allowed in global scope, must use a wrapper
module.exports = async function main(token, userEmail) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing

  //   let testAccount = await nodemailer.createTestAccount({
//     //   service: "gmail",
//       host: "smtp.gmail.com",
//       port: 587,
//       secure: false,
//       auth: {
//           user: "drraman9753@gmail.com",
//           pass: config.APP_PASSWORD,
//       } 
//   });

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service : "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'drraman9753@gmail.com', // generated ethereal user
      pass: config.APP_PASSWORD, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <contact@gmail.com>', // sender address
    to: "drraman9753@gmail.com", // list of receivers
    subject: "Token for reset", // Subject line
    text: "Hello world?", // plain text body
    html: 
    `<p>Your reset token is <b>${token}</b></p>`, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
//   console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}


