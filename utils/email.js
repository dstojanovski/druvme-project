const nodemailer = require('nodemailer');

const sendEmail = async options => {
    // 1) Create a transporter.

    // If you send mail throw GMAIL - Real Live scenario
    // const transporter = nodemailer.createTransport({
    //     host: procces.env.EMAIL_HOST,
    //     port: process.env.EMAIL_PORT,
    //         auth: {
    //             user: process.env.EMAIL_USERNAME,
    //             pass: process.env.EMAIL_PASSWORD,
    //         }
    //         // If you use gmail -> Activate in gmail "less secure app" option in the email account. 
    //     });
    // const transporter = nodemailer.createTransport({
    //     service: 'Gmail',
    //     auth: {
    //         host: procces.env.EMAIL_HOST,
    //         port: process.env.EMAIL_PORT,
    //         user: process.env.EMAIL_USERNAME,
    //         pass: process.env.EMAIL_PASSWORD,
    //     }
    //     // If you use gmail -> Activate in gmail "less secure app" option in the email account. 
    // });

    // From the MailTraper for NodeJS.
    var transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "953e5fb6c84e5d",
          pass: "0440e2b7af7c8d"
        }
      });

    // 2) Define the email options

    const mailOptions = {
        from: 'Dimitar Stojanovski <sstojanovskitest.dimitar@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message,
        // html:
    }


    // 3) Send the mail with nodemailer
    // This is async function
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;