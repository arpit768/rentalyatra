// Email Service Integration
// Supports SendGrid and Nodemailer

import type { NotificationType } from '../../services/notifications';

interface EmailConfig {
  provider: 'sendgrid' | 'nodemailer';
  sendgridApiKey?: string;
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPass?: string;
  fromEmail: string;
  fromName: string;
}

interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  private config: EmailConfig;
  private sendgrid: any;
  private nodemailer: any;

  constructor() {
    this.config = {
      provider: (process.env.EMAIL_PROVIDER as any) || 'sendgrid',
      sendgridApiKey: process.env.SENDGRID_API_KEY,
      smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
      smtpPort: parseInt(process.env.SMTP_PORT || '587'),
      smtpUser: process.env.SMTP_USER,
      smtpPass: process.env.SMTP_PASS,
      fromEmail: process.env.FROM_EMAIL || 'noreply@yatrarentals.com',
      fromName: process.env.FROM_NAME || 'Yatra Rentals Nepal',
    };

    this.initializeProvider();
  }

  private async initializeProvider() {
    if (this.config.provider === 'sendgrid') {
      try {
        // @ts-expect-error - Optional dependency: install with npm install @sendgrid/mail
        const sgMail = await import('@sendgrid/mail');
        this.sendgrid = sgMail.default;
        if (this.config.sendgridApiKey) {
          this.sendgrid.setApiKey(this.config.sendgridApiKey);
        }
      } catch (error) {
        console.warn('SendGrid not installed. Install with: npm install @sendgrid/mail');
      }
    } else {
      try {
        // @ts-expect-error - Optional dependency: install with npm install nodemailer
        const nodemailer = await import('nodemailer');
        this.nodemailer = nodemailer.default.createTransport({
          host: this.config.smtpHost,
          port: this.config.smtpPort,
          secure: this.config.smtpPort === 465,
          auth: {
            user: this.config.smtpUser,
            pass: this.config.smtpPass,
          },
        });
      } catch (error) {
        console.warn('Nodemailer not installed. Install with: npm install nodemailer');
      }
    }
  }

  /**
   * Send email using configured provider
   */
  async sendEmail(emailData: EmailData): Promise<{ success: boolean; messageId?: string }> {
    try {
      if (this.config.provider === 'sendgrid' && this.sendgrid) {
        return await this.sendWithSendGrid(emailData);
      } else if (this.config.provider === 'nodemailer' && this.nodemailer) {
        return await this.sendWithNodemailer(emailData);
      } else {
        // Fallback to console log in development
        return this.logEmail(emailData);
      }
    } catch (error) {
      console.error('Email send failed:', error);
      return { success: false };
    }
  }

  /**
   * Send email via SendGrid
   */
  private async sendWithSendGrid(emailData: EmailData): Promise<{ success: boolean; messageId?: string }> {
    const msg = {
      to: emailData.to,
      from: {
        email: this.config.fromEmail,
        name: this.config.fromName,
      },
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text || this.stripHtml(emailData.html),
    };

    const response = await this.sendgrid.send(msg);
    const messageId = response[0]?.headers?.['x-message-id'];

    return {
      success: true,
      messageId,
    };
  }

  /**
   * Send email via Nodemailer (SMTP)
   */
  private async sendWithNodemailer(emailData: EmailData): Promise<{ success: boolean; messageId?: string }> {
    const info = await this.nodemailer.sendMail({
      from: `"${this.config.fromName}" <${this.config.fromEmail}>`,
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text || this.stripHtml(emailData.html),
    });

    return {
      success: true,
      messageId: info.messageId,
    };
  }

  /**
   * Log email to console (development fallback)
   */
  private logEmail(emailData: EmailData): { success: boolean; messageId: string } {
    console.log('\n📧 Email (Console Mode)');
    console.log('To:', emailData.to);
    console.log('Subject:', emailData.subject);
    console.log('Body:', emailData.html.substring(0, 200) + '...');
    console.log('---\n');

    return {
      success: true,
      messageId: `CONSOLE_${Date.now()}`,
    };
  }

  /**
   * Strip HTML tags for plain text version
   */
  private stripHtml(html: string): string {
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .trim();
  }

  /**
   * Send templated email
   */
  async sendTemplatedEmail(
    to: string,
    type: NotificationType,
    data: any
  ): Promise<{ success: boolean; messageId?: string }> {
    const template = this.getEmailTemplate(type, data);

    return this.sendEmail({
      to,
      subject: template.subject,
      html: template.html,
    });
  }

  /**
   * Get email template by type
   */
  private getEmailTemplate(type: NotificationType, data: any): { subject: string; html: string } {
    const templates: Record<NotificationType, (data: any) => { subject: string; html: string }> = {
      booking_confirmed: (d) => ({
        subject: `Booking Confirmed - ${d.vehicle.name}`,
        html: this.wrapTemplate(`
          <h2>Booking Confirmation</h2>
          <p>Dear ${d.user.name},</p>
          <p>Your booking has been confirmed!</p>

          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Booking Details</h3>
            <table style="width: 100%;">
              <tr><td><strong>Vehicle:</strong></td><td>${d.vehicle.name}</td></tr>
              <tr><td><strong>Pickup Date:</strong></td><td>${d.booking.startDate}</td></tr>
              <tr><td><strong>Return Date:</strong></td><td>${d.booking.endDate}</td></tr>
              <tr><td><strong>Destination:</strong></td><td>${d.booking.destination}</td></tr>
              <tr><td><strong>Total Amount:</strong></td><td>NPR ${d.booking.totalPrice.toLocaleString()}</td></tr>
              ${d.booking.insurance ? '<tr><td><strong>Insurance:</strong></td><td>Included</td></tr>' : ''}
            </table>
          </div>

          <p><strong>Pickup Location:</strong> ${d.vehicle.location}</p>

          <h3>Important Information:</h3>
          <ul>
            <li>Please bring a valid driving license</li>
            <li>Government-issued ID is required</li>
            <li>International license required for foreign nationals</li>
            <li>Arrive 30 minutes before pickup time</li>
          </ul>

          <p>Thank you for choosing Yatra Rentals Nepal!</p>
          <p>Have a safe journey!</p>
        `),
      }),

      payment_successful: (d) => ({
        subject: `Payment Successful - NPR ${d.amount.toLocaleString()}`,
        html: this.wrapTemplate(`
          <h2>Payment Confirmation</h2>
          <p>Dear ${d.user.name},</p>
          <p>Your payment has been processed successfully!</p>

          <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
            <h3 style="margin-top: 0;">Payment Details</h3>
            <table style="width: 100%;">
              <tr><td><strong>Amount:</strong></td><td>NPR ${d.amount.toLocaleString()}</td></tr>
              <tr><td><strong>Payment ID:</strong></td><td>${d.paymentId}</td></tr>
              <tr><td><strong>Method:</strong></td><td>${d.method.toUpperCase()}</td></tr>
              <tr><td><strong>Date:</strong></td><td>${new Date().toLocaleDateString()}</td></tr>
            </table>
          </div>

          <p>Receipt has been sent to your email.</p>
          <p>Thank you for your payment!</p>
        `),
      }),

      booking_reminder: (d) => ({
        subject: `Booking Reminder - ${d.vehicle.name} in ${d.hoursUntil} hours`,
        html: this.wrapTemplate(`
          <h2>Booking Reminder</h2>
          <p>Dear ${d.user.name},</p>
          <p>This is a reminder that your booking starts in <strong>${d.hoursUntil} hours</strong>!</p>

          <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
            <h3 style="margin-top: 0;">Pickup Details</h3>
            <table style="width: 100%;">
              <tr><td><strong>Vehicle:</strong></td><td>${d.vehicle.name}</td></tr>
              <tr><td><strong>Date & Time:</strong></td><td>${d.booking.startDate}</td></tr>
              <tr><td><strong>Location:</strong></td><td>${d.vehicle.location}</td></tr>
            </table>
          </div>

          <h3>Don't Forget:</h3>
          <ul>
            <li>Valid driving license</li>
            <li>Government-issued ID</li>
            <li>Arrive 30 minutes early</li>
          </ul>

          <p>See you soon!</p>
        `),
      }),

      // Add other templates...
      booking_cancelled: (d) => ({ subject: '', html: '' }),
      payment_failed: (d) => ({ subject: '', html: '' }),
      vehicle_verified: (d) => ({ subject: '', html: '' }),
      vehicle_rejected: (d) => ({ subject: '', html: '' }),
      booking_completed: (d) => ({ subject: '', html: '' }),
    };

    return templates[type](data);
  }

  /**
   * Wrap email content in branded template
   */
  private wrapTemplate(content: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Yatra Rentals Nepal</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">🚗 Yatra Rentals Nepal</h1>
          <p style="margin: 5px 0 0 0; opacity: 0.9;">Your Journey, Our Wheels</p>
        </div>

        <div style="background: white; padding: 30px 20px; border: 1px solid #e5e7eb; border-top: none;">
          ${content}

          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
            <p>Best regards,<br><strong>Yatra Rentals Team</strong></p>
            <p>📧 Email: support@yatrarentals.com<br>
               📞 Phone: +977-1-1234567<br>
               🌐 Website: <a href="https://yatrarentals.com">yatrarentals.com</a></p>
          </div>
        </div>

        <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
          <p>&copy; ${new Date().getFullYear()} Yatra Rentals Nepal. All rights reserved.</p>
          <p>Kathmandu, Nepal</p>
        </div>
      </body>
      </html>
    `;
  }
}

export const emailService = new EmailService();
export default emailService;
