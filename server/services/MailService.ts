import BaseContext from "../di/BaseContext";
import { createTransport, SendMailOptions } from "nodemailer";
import type IServerContainer from "../di/IServerContainer";

export default class MailService extends BaseContext {
  private transporter;

  constructor(di: IServerContainer) {
    super(di);
    if (process.env.MAIL_USER && process.env.MAIL_PASS) {
      this.transporter = createTransport({
        host: "google",
        secure: false,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      });
    } else {
      console.error("No auth data for SMTP!");
    }
  }
  private isValidEmail(email: string) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  public sendRaw(to: string, body: string, title?: string) {
    this.send(to, body, title);
  }
  public sendHtml(to: string, body: string, title?: string) {
    this.send(to, body, title, true);
  }

  private async send(to: string, body: string, title?: string, html?: boolean) {
    if (this.transporter && this.isValidEmail(to)) {
      const opts: SendMailOptions = {
        from: `"EasyDiaryMail" <${process.env.MAIL_USER}>`,
        to,
        subject: title,
      };

      if (html) opts.html = body;
      else opts.text = body;

      await this.transporter.sendMail(opts);
    }
  }
}
