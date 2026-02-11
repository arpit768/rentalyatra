import type { User, Vehicle, Booking } from '../types';

export type NotificationType =
  | 'booking_confirmed'
  | 'booking_cancelled'
  | 'payment_successful'
  | 'payment_failed'
  | 'vehicle_verified'
  | 'vehicle_rejected'
  | 'booking_reminder'
  | 'booking_completed';

interface NotificationTemplate {
  subject: string;
  body: string;
  sms?: string;
}

// Email Templates
const emailTemplates: Record<NotificationType, (data: any) => NotificationTemplate> = {
  booking_confirmed: (data: { user: User; vehicle: Vehicle; booking: Booking }) => ({
    subject: `Booking Confirmed - ${data.vehicle.name}`,
    body: `
      <h2>Booking Confirmation</h2>
      <p>Dear ${data.user.name},</p>
      <p>Your booking has been confirmed!</p>

      <h3>Booking Details:</h3>
      <ul>
        <li><strong>Vehicle:</strong> ${data.vehicle.name}</li>
        <li><strong>Pickup Date:</strong> ${data.booking.startDate}</li>
        <li><strong>Return Date:</strong> ${data.booking.endDate}</li>
        <li><strong>Destination:</strong> ${data.booking.destination}</li>
        <li><strong>Total Amount:</strong> NPR ${data.booking.totalPrice.toLocaleString()}</li>
        ${data.booking.insurance ? '<li><strong>Insurance:</strong> Included</li>' : ''}
      </ul>

      <p><strong>Pickup Location:</strong> ${data.vehicle.location}</p>

      <h3>Important Information:</h3>
      <ul>
        <li>Please bring a valid driving license</li>
        <li>Government-issued ID is required</li>
        <li>International license required for foreign nationals</li>
        <li>Arrive 30 minutes before pickup time</li>
      </ul>

      <p>Thank you for choosing Yatra Rentals Nepal!</p>
      <p>Have a safe journey!</p>

      <p>Best regards,<br>Yatra Rentals Team</p>
    `,
    sms: `Booking confirmed! ${data.vehicle.name} from ${data.booking.startDate}. Location: ${data.vehicle.location}. Total: NPR ${data.booking.totalPrice}. Bring valid license & ID.`,
  }),

  booking_cancelled: (data: { user: User; vehicle: Vehicle; booking: Booking }) => ({
    subject: `Booking Cancelled - ${data.vehicle.name}`,
    body: `
      <h2>Booking Cancellation</h2>
      <p>Dear ${data.user.name},</p>
      <p>Your booking has been cancelled.</p>

      <h3>Cancelled Booking:</h3>
      <ul>
        <li><strong>Vehicle:</strong> ${data.vehicle.name}</li>
        <li><strong>Dates:</strong> ${data.booking.startDate} to ${data.booking.endDate}</li>
        <li><strong>Amount:</strong> NPR ${data.booking.totalPrice.toLocaleString()}</li>
      </ul>

      <p>Refund (if applicable) will be processed within 5-7 business days.</p>

      <p>We hope to serve you again soon!</p>
      <p>Best regards,<br>Yatra Rentals Team</p>
    `,
    sms: `Booking cancelled: ${data.vehicle.name}. Refund (if applicable) in 5-7 days. Thank you!`,
  }),

  payment_successful: (data: { user: User; amount: number; paymentId: string; method: string }) => ({
    subject: `Payment Successful - NPR ${data.amount.toLocaleString()}`,
    body: `
      <h2>Payment Confirmation</h2>
      <p>Dear ${data.user.name},</p>
      <p>Your payment has been processed successfully!</p>

      <h3>Payment Details:</h3>
      <ul>
        <li><strong>Amount:</strong> NPR ${data.amount.toLocaleString()}</li>
        <li><strong>Payment ID:</strong> ${data.paymentId}</li>
        <li><strong>Method:</strong> ${data.method.toUpperCase()}</li>
        <li><strong>Date:</strong> ${new Date().toLocaleDateString()}</li>
      </ul>

      <p>Receipt has been sent to your email.</p>

      <p>Thank you for your payment!</p>
      <p>Best regards,<br>Yatra Rentals Team</p>
    `,
    sms: `Payment successful! NPR ${data.amount.toLocaleString()} via ${data.method.toUpperCase()}. Ref: ${data.paymentId}.`,
  }),

  payment_failed: (data: { user: User; amount: number; reason: string }) => ({
    subject: `Payment Failed - NPR ${data.amount.toLocaleString()}`,
    body: `
      <h2>Payment Failed</h2>
      <p>Dear ${data.user.name},</p>
      <p>We were unable to process your payment.</p>

      <h3>Details:</h3>
      <ul>
        <li><strong>Amount:</strong> NPR ${data.amount.toLocaleString()}</li>
        <li><strong>Reason:</strong> ${data.reason}</li>
      </ul>

      <p>Please try again or contact support for assistance.</p>

      <p>Best regards,<br>Yatra Rentals Team</p>
    `,
    sms: `Payment failed: NPR ${data.amount.toLocaleString()}. Please try again or contact support.`,
  }),

  vehicle_verified: (data: { user: User; vehicle: Vehicle }) => ({
    subject: `Vehicle Verified - ${data.vehicle.name}`,
    body: `
      <h2>Vehicle Verification Approved</h2>
      <p>Dear ${data.user.name},</p>
      <p>Congratulations! Your vehicle has been verified and is now live on Yatra Rentals.</p>

      <h3>Vehicle Details:</h3>
      <ul>
        <li><strong>Name:</strong> ${data.vehicle.name}</li>
        <li><strong>Type:</strong> ${data.vehicle.type}</li>
        <li><strong>Location:</strong> ${data.vehicle.location}</li>
        <li><strong>Price:</strong> NPR ${data.vehicle.pricePerDay.toLocaleString()}/day</li>
      </ul>

      <p>Your vehicle is now visible to customers and ready for bookings!</p>

      <p>Best regards,<br>Yatra Rentals Team</p>
    `,
    sms: `Vehicle verified! ${data.vehicle.name} is now live. Start receiving bookings!`,
  }),

  vehicle_rejected: (data: { user: User; vehicle: Vehicle; reason: string }) => ({
    subject: `Vehicle Verification - Action Required`,
    body: `
      <h2>Vehicle Verification Update</h2>
      <p>Dear ${data.user.name},</p>
      <p>We were unable to verify your vehicle at this time.</p>

      <h3>Vehicle:</h3>
      <p>${data.vehicle.name} - ${data.vehicle.plateNumber}</p>

      <h3>Reason:</h3>
      <p>${data.reason}</p>

      <p>Please update your vehicle information and submit for verification again.</p>

      <p>Contact support if you need assistance.</p>
      <p>Best regards,<br>Yatra Rentals Team</p>
    `,
    sms: `Vehicle verification needs attention. Please check your email for details.`,
  }),

  booking_reminder: (data: { user: User; vehicle: Vehicle; booking: Booking; hoursUntil: number }) => ({
    subject: `Booking Reminder - ${data.vehicle.name} in ${data.hoursUntil} hours`,
    body: `
      <h2>Booking Reminder</h2>
      <p>Dear ${data.user.name},</p>
      <p>This is a reminder that your booking starts in ${data.hoursUntil} hours!</p>

      <h3>Pickup Details:</h3>
      <ul>
        <li><strong>Vehicle:</strong> ${data.vehicle.name}</li>
        <li><strong>Date & Time:</strong> ${data.booking.startDate}</li>
        <li><strong>Location:</strong> ${data.vehicle.location}</li>
      </ul>

      <h3>Don't Forget:</h3>
      <ul>
        <li>Valid driving license</li>
        <li>Government-issued ID</li>
        <li>Arrive 30 minutes early</li>
      </ul>

      <p>See you soon!</p>
      <p>Best regards,<br>Yatra Rentals Team</p>
    `,
    sms: `Reminder: ${data.vehicle.name} pickup in ${data.hoursUntil}hrs at ${data.vehicle.location}. Bring license & ID!`,
  }),

  booking_completed: (data: { user: User; vehicle: Vehicle; booking: Booking }) => ({
    subject: `Thank You - ${data.vehicle.name}`,
    body: `
      <h2>Thank You!</h2>
      <p>Dear ${data.user.name},</p>
      <p>Thank you for completing your rental with Yatra Rentals Nepal!</p>

      <h3>Rental Summary:</h3>
      <ul>
        <li><strong>Vehicle:</strong> ${data.vehicle.name}</li>
        <li><strong>Duration:</strong> ${data.booking.startDate} to ${data.booking.endDate}</li>
        <li><strong>Destination:</strong> ${data.booking.destination}</li>
      </ul>

      <p>We hope you had a great experience!</p>
      <p>Please take a moment to rate and review the vehicle.</p>

      <p>We look forward to serving you again!</p>
      <p>Best regards,<br>Yatra Rentals Team</p>
    `,
    sms: `Thank you for renting ${data.vehicle.name}! Please rate your experience.`,
  }),
};

// Notification Service
export const notificationService = {
  // Send Email
  sendEmail: async (
    to: string,
    type: NotificationType,
    data: any
  ): Promise<{ success: boolean; messageId?: string }> => {
    try {
      const template = emailTemplates[type](data);

      // In production, integrate with email service (SendGrid, Mailgun, etc.)
      console.log(`📧 Sending email to: ${to}`);
      console.log(`Subject: ${template.subject}`);
      console.log(`Body: ${template.body.substring(0, 100)}...`);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const messageId = `EMAIL_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      return { success: true, messageId };
    } catch (error) {
      console.error('Email send failed:', error);
      return { success: false };
    }
  },

  // Send SMS
  sendSMS: async (
    to: string,
    type: NotificationType,
    data: any
  ): Promise<{ success: boolean; messageId?: string }> => {
    try {
      const template = emailTemplates[type](data);

      if (!template.sms) {
        return { success: false };
      }

      // In production, integrate with SMS service (Twilio, Sparrow SMS, etc.)
      console.log(`📱 Sending SMS to: ${to}`);
      console.log(`Message: ${template.sms}`);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const messageId = `SMS_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      return { success: true, messageId };
    } catch (error) {
      console.error('SMS send failed:', error);
      return { success: false };
    }
  },

  // Send Both Email & SMS
  sendNotification: async (
    email: string,
    phone: string | undefined,
    type: NotificationType,
    data: any
  ): Promise<{ emailSuccess: boolean; smsSuccess: boolean }> => {
    const emailResult = await notificationService.sendEmail(email, type, data);
    const smsResult = phone
      ? await notificationService.sendSMS(phone, type, data)
      : { success: false };

    return {
      emailSuccess: emailResult.success,
      smsSuccess: smsResult.success,
    };
  },

  // Get notification template preview
  getPreview: (type: NotificationType, data: any): NotificationTemplate => {
    return emailTemplates[type](data);
  },
};

export default notificationService;
