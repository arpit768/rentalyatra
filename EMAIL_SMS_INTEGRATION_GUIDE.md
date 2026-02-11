# 📧📱 Email & SMS Integration Guide

Complete guide to integrate email and SMS services for Yatra Rentals Nepal.

---

## 📋 Overview

### Email Providers
1. **SendGrid** (Recommended)
2. **Nodemailer** (SMTP - Gmail, custom)

### SMS Providers
1. **Twilio** (International)
2. **Sparrow SMS** (Nepal-specific)

---

## 📧 Email Integration

### Option 1: SendGrid (Recommended)

#### Step 1: Get SendGrid API Key

1. Sign up at [SendGrid](https://sendgrid.com)
2. Go to Settings → API Keys
3. Create new API key with "Mail Send" permissions
4. Copy the API key

#### Step 2: Install Dependencies

```bash
cd server
npm install @sendgrid/mail
```

#### Step 3: Configure Environment

Add to `server/.env`:
```env
# SendGrid Configuration
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
FROM_EMAIL=noreply@yatrarentals.com
FROM_NAME=Yatra Rentals Nepal
```

#### Step 4: Verify Sender Email

1. Go to SendGrid → Settings → Sender Authentication
2. Choose "Single Sender Verification"
3. Add `noreply@yatrarentals.com`
4. Verify email address

#### Step 5: Use Email Service

```typescript
import emailService from './services/email';

// Send booking confirmation
await emailService.sendTemplatedEmail(
  'customer@example.com',
  'booking_confirmed',
  {
    user: { name: 'Ram Kumar' },
    vehicle: { name: 'Mahindra Scorpio', location: 'Kathmandu' },
    booking: {
      startDate: '2026-03-01',
      endDate: '2026-03-05',
      destination: 'Pokhara',
      totalPrice: 20000,
      insurance: true,
    },
  }
);
```

### Option 2: Nodemailer (SMTP)

#### Step 1: Install Dependencies

```bash
npm install nodemailer
```

#### Step 2: Configure Environment

##### For Gmail:
```env
EMAIL_PROVIDER=nodemailer
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@yatrarentals.com
FROM_NAME=Yatra Rentals Nepal
```

**Note:** For Gmail, use [App Password](https://support.google.com/accounts/answer/185833), not your regular password.

##### For Custom SMTP:
```env
EMAIL_PROVIDER=nodemailer
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=587
SMTP_USER=noreply@yatrarentals.com
SMTP_PASS=your-password
FROM_EMAIL=noreply@yatrarentals.com
FROM_NAME=Yatra Rentals Nepal
```

#### Step 3: Test Connection

```typescript
import emailService from './services/email';

// Test email
await emailService.sendEmail({
  to: 'test@example.com',
  subject: 'Test Email',
  html: '<p>This is a test email.</p>',
});
```

---

## 📱 SMS Integration

### Option 1: Twilio (International)

#### Step 1: Get Twilio Credentials

1. Sign up at [Twilio](https://www.twilio.com)
2. Get a phone number (Nepal: +977 numbers available)
3. Copy Account SID and Auth Token from dashboard

#### Step 2: Install Dependencies

```bash
npm install twilio
```

#### Step 3: Configure Environment

```env
# Twilio Configuration
SMS_PROVIDER=twilio
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE=+977xxxxxxxxxx
```

#### Step 4: Use SMS Service

```typescript
import smsService from './services/sms';

// Send booking confirmation SMS
await smsService.sendTemplatedSms(
  '+9779812345678',
  'booking_confirmed',
  {
    vehicle: { name: 'Mahindra Scorpio', location: 'Kathmandu' },
    booking: {
      startDate: '2026-03-01',
      totalPrice: 20000,
    },
  }
);
```

### Option 2: Sparrow SMS (Nepal)

#### Step 1: Get Sparrow SMS Token

1. Visit [Sparrow SMS](https://sparrowsms.com)
2. Sign up for merchant account
3. Get API token from dashboard
4. Choose sender name (e.g., "InfoSMS", "YatraRent")

#### Step 2: Configure Environment

```env
# Sparrow SMS Configuration
SMS_PROVIDER=sparrow
SPARROW_SMS_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SPARROW_SMS_FROM=InfoSMS
```

#### Step 3: Use SMS Service

```typescript
import smsService from './services/sms';

// Format Nepal phone number
const phone = smsService.formatNepalPhone('9812345678');

// Send SMS
await smsService.sendSms({
  to: phone,
  message: 'Your booking is confirmed! Details: ...',
});
```

---

## 🔄 Complete Notification Flow

### Update Notification Service

Edit `services/notifications.ts`:

```typescript
import emailService from './email';
import smsService from './sms';

export const notificationService = {
  sendNotification: async (
    email: string,
    phone: string | undefined,
    type: NotificationType,
    data: any
  ): Promise<{ emailSuccess: boolean; smsSuccess: boolean }> => {
    // Send email
    const emailResult = await emailService.sendTemplatedEmail(email, type, data);

    // Send SMS
    let smsResult = { success: false };
    if (phone) {
      const formattedPhone = smsService.formatNepalPhone(phone);
      smsResult = await smsService.sendTemplatedSms(formattedPhone, type, data);
    }

    return {
      emailSuccess: emailResult.success,
      smsSuccess: smsResult.success,
    };
  },
};
```

---

## 🎨 Email Templates

### Branded Email Design

All emails use branded template with:
- Blue gradient header
- Company logo
- Structured content sections
- Footer with contact info
- Mobile-responsive design

### Available Templates

1. **booking_confirmed** - Booking confirmation with details
2. **booking_cancelled** - Cancellation notice
3. **payment_successful** - Payment receipt
4. **payment_failed** - Payment failure notice
5. **vehicle_verified** - Vehicle approval
6. **vehicle_rejected** - Vehicle rejection
7. **booking_reminder** - Pickup reminder
8. **booking_completed** - Thank you & review request

### Customize Templates

Edit `services/email.ts` → `getEmailTemplate()`:

```typescript
booking_confirmed: (d) => ({
  subject: `Booking Confirmed - ${d.vehicle.name}`,
  html: this.wrapTemplate(`
    <h2>Your Custom Content</h2>
    <p>Dear ${d.user.name},</p>
    <!-- Add your custom HTML -->
  `),
}),
```

---

## 📊 Email Analytics

### SendGrid Analytics

1. Login to SendGrid Dashboard
2. Go to Activity → Stats
3. View:
   - Delivery rate
   - Open rate
   - Click rate
   - Bounce rate

### Track in Database

```typescript
// Save notification record
await prisma.notification.create({
  data: {
    type: 'BOOKING_CONFIRMED',
    recipient: email,
    subject: template.subject,
    body: template.html,
    status: emailResult.success ? 'SENT' : 'FAILED',
  },
});
```

---

## 🧪 Testing

### Email Testing

#### Development Mode
```typescript
// Automatically logs to console if no provider configured
await emailService.sendEmail({
  to: 'test@example.com',
  subject: 'Test',
  html: '<p>Test</p>',
});

// Output:
// 📧 Email (Console Mode)
// To: test@example.com
// Subject: Test
// Body: Test
```

#### Test Email Services

1. **Mailtrap** - Fake SMTP for testing
   ```env
   SMTP_HOST=smtp.mailtrap.io
   SMTP_PORT=2525
   SMTP_USER=your_mailtrap_user
   SMTP_PASS=your_mailtrap_pass
   ```

2. **Ethereal Email** - Free test SMTP
   ```bash
   # Generate test account
   npx nodemailer-test-account
   ```

### SMS Testing

#### Twilio Test Numbers
```
Use Twilio test credentials to avoid charges:
Test Phone: +15005550006 (always succeeds)
```

#### Sparrow SMS Test
```
Sparrow provides test API for development
Contact support for test token
```

---

## 💰 Cost Estimates

### Email Costs

**SendGrid:**
- Free: 100 emails/day
- Essentials: $19.95/month (50,000 emails)
- Pro: $89.95/month (100,000 emails)

**SMTP (Gmail):**
- Free: 500 emails/day
- Workspace: $6/user/month (unlimited)

### SMS Costs

**Twilio:**
- Nepal SMS: ~$0.07/SMS
- $20 credit for free trial

**Sparrow SMS:**
- Nepal SMS: NPR 0.40-0.60/SMS
- Bulk rates available
- No monthly fees

---

## 🔐 Security Best Practices

### 1. Protect API Keys

```typescript
// ❌ WRONG
const apiKey = 'SG.xxxxxxxxx';

// ✅ CORRECT
const apiKey = process.env.SENDGRID_API_KEY;
```

### 2. Rate Limiting

```typescript
// Limit emails per user
const emailCount = await redis.get(`email:${userId}:count`);
if (emailCount > 10) {
  throw new Error('Email rate limit exceeded');
}
```

### 3. Unsubscribe Links

```html
<!-- Add to email footer -->
<p style="font-size: 12px; color: #999;">
  <a href="{{unsubscribe_url}}">Unsubscribe</a> from marketing emails
</p>
```

### 4. SPF & DKIM

Set up for your domain:
```
SPF: v=spf1 include:sendgrid.net ~all
DKIM: Add CNAME records from SendGrid
```

---

## 🚀 Production Checklist

### Email Setup
- [ ] Get production API keys
- [ ] Verify sender email/domain
- [ ] Setup SPF/DKIM records
- [ ] Test all email templates
- [ ] Configure unsubscribe handling
- [ ] Setup email analytics
- [ ] Add rate limiting
- [ ] Test spam score (Mail Tester)

### SMS Setup
- [ ] Get production credentials
- [ ] Verify phone number
- [ ] Test SMS delivery
- [ ] Setup delivery reports
- [ ] Configure opt-out handling
- [ ] Add rate limiting
- [ ] Monitor costs

---

## 📝 Environment Variables Summary

Complete `.env` for server:

```env
# Server
NODE_ENV=production
PORT=3001

# Email (Choose one)
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=SG.xxxxxxxxx
# EMAIL_PROVIDER=nodemailer
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your-email@gmail.com
# SMTP_PASS=your-app-password

FROM_EMAIL=noreply@yatrarentals.com
FROM_NAME=Yatra Rentals Nepal

# SMS (Choose one)
SMS_PROVIDER=sparrow
SPARROW_SMS_TOKEN=xxxxxxxxx
SPARROW_SMS_FROM=InfoSMS
# SMS_PROVIDER=twilio
# TWILIO_ACCOUNT_SID=ACxxxxxxxxx
# TWILIO_AUTH_TOKEN=xxxxxxxxx
# TWILIO_PHONE=+977xxxxxxxxx
```

---

## 🔧 Troubleshooting

### Email Issues

**Emails not sending:**
```bash
# Check API key
echo $SENDGRID_API_KEY

# Test connection
curl -i --request POST \
  --url https://api.sendgrid.com/v3/mail/send \
  --header "Authorization: Bearer $SENDGRID_API_KEY" \
  --header 'Content-Type: application/json' \
  --data '{"personalizations":[{"to":[{"email":"test@example.com"}]}],"from":{"email":"noreply@yatrarentals.com"},"subject":"Test","content":[{"type":"text/plain","value":"Test"}]}'
```

**Emails going to spam:**
- Setup SPF/DKIM
- Verify sender domain
- Check spam score at [Mail Tester](https://www.mail-tester.com)

### SMS Issues

**SMS not delivering:**
- Verify phone number format
- Check account balance
- Verify sender ID is approved
- Test with known working number

---

## 📞 Support

### SendGrid Support
- Docs: https://docs.sendgrid.com
- Support: https://support.sendgrid.com

### Twilio Support
- Docs: https://www.twilio.com/docs
- Support: https://support.twilio.com

### Sparrow SMS Support
- Website: https://sparrowsms.com
- Email: support@janakitech.com
- Phone: 01-5970566

---

## 📚 Files Created

- `/server/services/email.ts` - Email service with SendGrid & Nodemailer
- `/server/services/sms.ts` - SMS service with Twilio & Sparrow
- Updated `/server/services/notifications.ts` - Integrated email & SMS

---

**Email & SMS Integration Status:** Production-ready!
**Providers:** Multiple options available
**Templates:** 8 notification types ready

📧📱 **Ready to communicate with customers!**
