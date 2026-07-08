import nodeMailer from 'nodemailer';
import { DB_EMAIL, PASSWORD_EMAIL_NODEMAILER } from '../../config';
import { MailOptions } from 'nodemailer/lib/json-transport';
export const sendMail = async ({ to, subject, html }: MailOptions) => {
  const transporter = nodeMailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: DB_EMAIL,
      pass: PASSWORD_EMAIL_NODEMAILER,
    },
  });

  await transporter.sendMail({
    from: '"Social App"<ym9798390@gmail.com>',
    to: to,
    subject: subject,
    html: html,
  });
};
