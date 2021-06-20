import nodemailer from 'nodemailer';

type emailOptions = {
  email: string;
  message: string;
  subject: string;
}

export const sendEmail = async (options: emailOptions) => {
  // create a transport
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 2525,
    // secure: false,
    // requireTLS: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  // define mail options
  const mailOptions = {
    from: 'Social Media <olumorinsammy@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
}
