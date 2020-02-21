const nodeMailer = require("nodemailer");

exports.sendEmail = emailData => {
  const transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "rafaewaqar@gmail.com",
      pass: "gqikrscbwhfwuzxm"
    }
  });
  return (
    transporter
      .sendMail(emailData)
      .then(info => console.log(`Message sent: ${info.response}`))
      .catch(err => console.log(`Problem sending email: ${err}`))
  );
};