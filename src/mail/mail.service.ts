import { Injectable } from "@nestjs/common";
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 587,
    auth: {
      user: process.env.USERNAME_EMAIL,
      pass: process.env.PASSWORD_EMAIL,
    },
  });

  async sendEmail(to: string, subject: string, text: string) {
    return await this.transporter.sendMail({
      from: '"Ecommerce API" <no-reply@test.com>',
      to,
      subject,
      text,
    });
  }
}