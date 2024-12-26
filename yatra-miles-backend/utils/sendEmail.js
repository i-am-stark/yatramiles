const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
  try {
    // Create a transporter using Gmail SMTP with App Password
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL, // Your email address
        pass: process.env.EMAIL_PASSWORD, // Your Gmail App Password
      },
    });

    // Mail options
    const mailOptions = {
      from: `YatraMiles <${process.env.EMAIL}>`,
      to,
      subject,
      text,
    };

    // Send the email
    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result);
    return result;
  } catch (error) {
    console.error('Error sending email:', error.message);
    throw new Error('Failed to send email');
  }
};

module.exports = sendEmail;
