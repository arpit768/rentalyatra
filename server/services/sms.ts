// SMS Service Integration
// Supports Twilio and Sparrow SMS (Nepal)

import type { NotificationType } from '../../services/notifications';

interface SmsConfig {
  provider: 'twilio' | 'sparrow';
  twilioAccountSid?: string;
  twilioAuthToken?: string;
  twilioPhone?: string;
  sparrowToken?: string;
  sparrowFrom?: string;
}

interface SmsData {
  to: string;
  message: string;
}

class SmsService {
  private config: SmsConfig;
  private twilio: any;

  constructor() {
    this.config = {
      provider: (process.env.SMS_PROVIDER as any) || 'twilio',
      twilioAccountSid: process.env.TWILIO_ACCOUNT_SID,
      twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
      twilioPhone: process.env.TWILIO_PHONE,
      sparrowToken: process.env.SPARROW_SMS_TOKEN,
      sparrowFrom: process.env.SPARROW_SMS_FROM || 'InfoSMS',
    };

    this.initializeProvider();
  }

  private async initializeProvider() {
    if (this.config.provider === 'twilio') {
      try {
        // @ts-expect-error - Optional dependency: install with npm install twilio
        const twilioModule = await import('twilio');
        if (this.config.twilioAccountSid && this.config.twilioAuthToken) {
          this.twilio = twilioModule.default(
            this.config.twilioAccountSid,
            this.config.twilioAuthToken
          );
        }
      } catch (error) {
        console.warn('Twilio not installed. Install with: npm install twilio');
      }
    }
  }

  /**
   * Send SMS using configured provider
   */
  async sendSms(smsData: SmsData): Promise<{ success: boolean; messageId?: string }> {
    try {
      if (this.config.provider === 'twilio' && this.twilio) {
        return await this.sendWithTwilio(smsData);
      } else if (this.config.provider === 'sparrow') {
        return await this.sendWithSparrow(smsData);
      } else {
        return this.logSms(smsData);
      }
    } catch (error) {
      console.error('SMS send failed:', error);
      return { success: false };
    }
  }

  /**
   * Send SMS via Twilio
   */
  private async sendWithTwilio(smsData: SmsData): Promise<{ success: boolean; messageId?: string }> {
    const message = await this.twilio.messages.create({
      body: smsData.message,
      from: this.config.twilioPhone,
      to: smsData.to,
    });

    return {
      success: true,
      messageId: message.sid,
    };
  }

  /**
   * Send SMS via Sparrow SMS (Nepal)
   */
  private async sendWithSparrow(smsData: SmsData): Promise<{ success: boolean; messageId?: string }> {
    const url = 'http://api.sparrowsms.com/v2/sms/';

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.sparrowToken}`,
      },
      body: JSON.stringify({
        from: this.config.sparrowFrom,
        to: smsData.to,
        text: smsData.message,
      }),
    });

    const data = await response.json();

    if (data.response_code === 200) {
      return {
        success: true,
        messageId: data.count,
      };
    } else {
      throw new Error(data.message || 'Sparrow SMS failed');
    }
  }

  /**
   * Log SMS to console (development fallback)
   */
  private logSms(smsData: SmsData): { success: boolean; messageId: string } {
    console.log('\n📱 SMS (Console Mode)');
    console.log('To:', smsData.to);
    console.log('Message:', smsData.message);
    console.log('---\n');

    return {
      success: true,
      messageId: `CONSOLE_SMS_${Date.now()}`,
    };
  }

  /**
   * Send templated SMS
   */
  async sendTemplatedSms(
    to: string,
    type: NotificationType,
    data: any
  ): Promise<{ success: boolean; messageId?: string }> {
    const message = this.getSmsTemplate(type, data);

    return this.sendSms({
      to,
      message,
    });
  }

  /**
   * Get SMS template by type
   */
  private getSmsTemplate(type: NotificationType, data: any): string {
    const templates: Record<NotificationType, (data: any) => string> = {
      booking_confirmed: (d) =>
        `Booking confirmed! ${d.vehicle.name} from ${d.booking.startDate}. Location: ${d.vehicle.location}. Total: NPR ${d.booking.totalPrice}. Bring valid license & ID.`,

      booking_cancelled: (d) =>
        `Booking cancelled: ${d.vehicle.name}. Refund (if applicable) in 5-7 days. Thank you!`,

      payment_successful: (d) =>
        `Payment successful! NPR ${d.amount.toLocaleString()} via ${d.method.toUpperCase()}. Ref: ${d.paymentId}.`,

      payment_failed: (d) =>
        `Payment failed: NPR ${d.amount.toLocaleString()}. Please try again or contact support.`,

      vehicle_verified: (d) =>
        `Vehicle verified! ${d.vehicle.name} is now live. Start receiving bookings!`,

      vehicle_rejected: (d) =>
        `Vehicle verification needs attention. Please check your email for details.`,

      booking_reminder: (d) =>
        `Reminder: ${d.vehicle.name} pickup in ${d.hoursUntil}hrs at ${d.vehicle.location}. Bring license & ID!`,

      booking_completed: (d) =>
        `Thank you for renting ${d.vehicle.name}! Please rate your experience.`,
    };

    return templates[type](data);
  }

  /**
   * Format Nepal phone number
   */
  formatNepalPhone(phone: string): string {
    // Remove spaces, dashes, and plus signs
    let cleaned = phone.replace(/[\s\-+]/g, '');

    // Add Nepal country code if not present
    if (!cleaned.startsWith('977')) {
      cleaned = '977' + cleaned;
    }

    // Add plus sign for international format
    if (!cleaned.startsWith('+')) {
      cleaned = '+' + cleaned;
    }

    return cleaned;
  }
}

export const smsService = new SmsService();
export default smsService;
