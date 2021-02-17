import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  // 1) create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth:{
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
    // Activate in gmail *less secure app* option
  })
  // 2) Define the email options
  const mailOptions = {
    from: 'Innocent Ingabire <inno100os@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  }
  // 3) Actually send the email
  await transporter.sendMail(mailOptions)
}

export default sendEmail