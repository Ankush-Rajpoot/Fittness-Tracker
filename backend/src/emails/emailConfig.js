import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // Replace with your SMTP server
  port: 587,
  auth: {
    user: process.env.EMAIL_USER, // Replace with your Mailtrap username
    pass: process.env.EMAIL_PASS,  // Replace with your Mailtrap password
  }
});

export const sender = '"UFit" <ufitoriginals2004@gmail.com>'; // Replace with your sender email