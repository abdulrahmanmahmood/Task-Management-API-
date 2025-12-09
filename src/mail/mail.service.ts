import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private readonly logger = new Logger();
  constructor(
    private readonly mailService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendResetPasswordEmail(
    email: string,
    code: string,
    firstName?: string,
  ) {
    try {
      await this.mailService.sendMail({
        to: email,
        subject: 'Reset Password',
        template: 'reset-password',
        context: {
          firstName: firstName || 'there',
          link: 'https://linkktoresetpassword',
          code: code,
          expiration: '15',
        },
      });
    } catch (error) {
      this.logger.error('Failed to send reset password email:', error);
    }
  }
}
