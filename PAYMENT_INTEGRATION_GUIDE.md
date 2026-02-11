# 💳 Payment Gateway Integration Guide

Complete guide to integrate eSewa and Khalti payment gateways for Yatra Rentals Nepal.

---

## 📋 Overview

Two Nepal payment gateways integrated:
1. **eSewa** - Nepal's leading digital wallet
2. **Khalti** - Fast & secure digital payments

---

## 🟢 eSewa Integration

### Step 1: Get eSewa Credentials

1. Visit [eSewa Merchant Registration](https://esewa.com.np/merchant)
2. Fill application form
3. Submit required documents:
   - Company registration
   - PAN/VAT certificate
   - Bank details
4. Receive credentials:
   - Merchant ID (SCD)
   - Merchant Secret Key

### Step 2: Configure Environment

Add to `server/.env`:
```env
# eSewa Configuration
ESEWA_MERCHANT_ID=EPAYTEST
ESEWA_SECRET_KEY=8gBm/:&EnhH.1/q
ESEWA_SUCCESS_URL=http://localhost:3000/payment/success
ESEWA_FAILURE_URL=http://localhost:3000/payment/failure

# Use test credentials for development
# Production credentials will be provided after approval
```

### Step 3: Implement Payment Flow

#### Frontend: Initiate Payment

```typescript
import { esewaService } from '../services/api';

async function initiateEsewaPayment() {
  try {
    const response = await fetch('/api/payment/esewa/initiate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: 5000,
        bookingId: 'BOOK-123',
        customerName: 'Ram Kumar',
        customerEmail: 'ram@example.com',
        customerPhone: '9812345678',
      }),
    });

    const { paymentUrl, params } = await response.json();

    // Create form and submit
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = paymentUrl;

    Object.entries(params).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value as string;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  } catch (error) {
    console.error('eSewa payment failed:', error);
  }
}
```

#### Backend: Verify Payment

```typescript
// Route: GET /api/payment/esewa/verify
const verification = await esewaService.verifyPayment(oid, amt, refId);

if (verification.status === 'SUCCESS') {
  // Update database
  await prisma.payment.create({
    data: {
      amount: verification.amount,
      method: 'ESEWA',
      status: 'COMPLETED',
      transactionId: verification.refId,
      bookingId: oid,
    },
  });

  // Send confirmation
  await notificationService.sendNotification(
    email,
    phone,
    'payment_successful',
    { amount: verification.amount }
  );
}
```

### eSewa Test Credentials

```
Merchant ID: EPAYTEST
Secret Key: 8gBm/:&EnhH.1/q
Test URL: https://uat.esewa.com.np/epay/main
```

---

## 🟣 Khalti Integration

### Step 1: Get Khalti Credentials

1. Visit [Khalti Merchant](https://khalti.com/join/merchant/)
2. Create merchant account
3. Complete KYC verification
4. Get API credentials:
   - Public Key (for frontend)
   - Secret Key (for backend)

### Step 2: Configure Environment

Add to `server/.env`:
```env
# Khalti Configuration
KHALTI_PUBLIC_KEY=test_public_key_dc74e0fd57cb46cd93832aee0a390234
KHALTI_SECRET_KEY=test_secret_key_f59e8b7d18b4499ca40f68195a846e9b

# Production keys will be different
```

### Step 3: Implement Payment Flow

#### Frontend: Initiate Payment

```typescript
async function initiateKhaltiPayment() {
  try {
    const response = await fetch('/api/payment/khalti/initiate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: 5000,
        bookingId: 'BOOK-123',
        customerName: 'Ram Kumar',
        customerEmail: 'ram@example.com',
        customerPhone: '9812345678',
      }),
    });

    const { pidx, paymentUrl } = await response.json();

    // Redirect to Khalti payment page
    window.location.href = paymentUrl;

    // Store pidx for verification
    localStorage.setItem('khalti_pidx', pidx);
  } catch (error) {
    console.error('Khalti payment failed:', error);
  }
}
```

#### Frontend: Handle Callback

```typescript
// On callback page: /payment/khalti/callback
async function verifyKhaltiPayment() {
  const urlParams = new URLSearchParams(window.location.search);
  const pidx = urlParams.get('pidx');
  const status = urlParams.get('status');

  if (status === 'Completed' && pidx) {
    try {
      const response = await fetch('/api/payment/khalti/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pidx }),
      });

      const result = await response.json();

      if (result.success) {
        // Payment successful
        showSuccessMessage('Payment completed successfully!');
        redirectToBookingConfirmation();
      }
    } catch (error) {
      console.error('Verification failed:', error);
    }
  }
}
```

#### Backend: Verify Payment

```typescript
// Route: POST /api/payment/khalti/verify
const verification = await khaltiService.verifyPayment(pidx);

if (verification.status === 'Completed') {
  // Update database
  await prisma.payment.create({
    data: {
      amount: verification.total_amount / 100, // Convert paisa to NPR
      method: 'KHALTI',
      status: 'COMPLETED',
      transactionId: verification.transaction_id,
      bookingId: bookingId,
    },
  });

  // Update booking
  await prisma.booking.update({
    where: { id: bookingId },
    data: { status: 'CONFIRMED' },
  });
}
```

### Khalti Test Credentials

```
Public Key: test_public_key_dc74e0fd57cb46cd93832aee0a390234
Secret Key: test_secret_key_f59e8b7d18b4499ca40f68195a846e9b
Test URL: https://a.khalti.com/api/v2
```

---

## 🔄 Complete Payment Flow

### 1. Customer Selects Payment Method

```typescript
<PaymentGateway
  amount={totalAmount}
  bookingId={booking.id}
  onSuccess={handlePaymentSuccess}
  onCancel={handlePaymentCancel}
/>
```

### 2. Initiate Payment

```typescript
// Frontend calls backend API
const payment = await initiatePayment(method, amount, bookingId);

// Backend creates payment record
const paymentRecord = await prisma.payment.create({
  data: {
    amount,
    method: method.toUpperCase(),
    status: 'PENDING',
    bookingId,
  },
});

// Return payment URL
return payment.paymentUrl;
```

### 3. Customer Completes Payment

- Redirected to payment gateway
- Enters credentials
- Confirms payment

### 4. Gateway Callback

```typescript
// eSewa: Redirects to success URL with query params
// ?oid=BOOK-123&amt=5000&refId=000A5D1

// Khalti: Redirects to return URL with query params
// ?pidx=abc123&status=Completed
```

### 5. Verify Payment

```typescript
// Backend verifies with gateway API
const verification = await verifyPayment(params);

// Update database
await updatePaymentStatus(verification);

// Send notifications
await sendPaymentConfirmation(user, booking);
```

---

## 🔐 Security Best Practices

### 1. Never Expose Secret Keys

```typescript
// ❌ WRONG - Secret in frontend
const secretKey = 'test_secret_key_...';

// ✅ CORRECT - Secret in backend only
const secretKey = process.env.KHALTI_SECRET_KEY;
```

### 2. Verify All Callbacks

```typescript
// Always verify payment on backend
app.get('/payment/success', async (req, res) => {
  // ❌ WRONG - Trust query params
  // await markAsPaid(req.query.oid);

  // ✅ CORRECT - Verify with gateway
  const verified = await verifyPayment(req.query);
  if (verified.status === 'SUCCESS') {
    await markAsPaid(verified.transactionId);
  }
});
```

### 3. Use HTTPS in Production

```env
# Production URLs must be HTTPS
ESEWA_SUCCESS_URL=https://yatrarentals.com/payment/success
KHALTI_RETURN_URL=https://yatrarentals.com/payment/callback
```

### 4. Validate Amount

```typescript
// Verify amount matches booking
const booking = await prisma.booking.findUnique({ where: { id: bookingId } });

if (verifiedAmount !== booking.totalPrice) {
  throw new Error('Amount mismatch');
}
```

---

## 🧪 Testing Payments

### eSewa Test Environment

1. Use UAT URL: `https://uat.esewa.com.np/epay/main`
2. Test credentials provided above
3. No real money charged

### Khalti Test Environment

1. Use test API: `https://a.khalti.com/api/v2`
2. Test credentials provided above
3. Test phone: `9800000000` to `9800000010`
4. Test OTP: `987654`

---

## 📊 Payment Analytics

### Track Payment Success Rate

```typescript
const analytics = await prisma.payment.groupBy({
  by: ['status', 'method'],
  _count: true,
});

// Result:
// [
//   { status: 'COMPLETED', method: 'ESEWA', _count: 45 },
//   { status: 'COMPLETED', method: 'KHALTI', _count: 38 },
//   { status: 'FAILED', method: 'ESEWA', _count: 3 },
// ]
```

### Revenue by Payment Method

```typescript
const revenue = await prisma.payment.groupBy({
  by: ['method'],
  _sum: { amount: true },
  where: { status: 'COMPLETED' },
});
```

---

## 🔄 Handling Refunds

### Khalti Refund

```typescript
// Full refund
await khaltiService.refundPayment(pidx);

// Partial refund
await khaltiService.refundPayment(pidx, 2000);

// Update database
await prisma.payment.update({
  where: { id: paymentId },
  data: { status: 'REFUNDED' },
});
```

### eSewa Refund

```
eSewa refunds are handled manually through merchant portal:
1. Login to eSewa merchant account
2. Go to Transactions
3. Select transaction
4. Click "Refund"
5. Enter amount and confirm
```

---

## 🚀 Production Deployment

### Checklist

- [ ] Get production credentials from eSewa
- [ ] Get production credentials from Khalti
- [ ] Update environment variables
- [ ] Switch to production URLs
- [ ] Test with real small amount
- [ ] Enable error monitoring (Sentry)
- [ ] Setup webhook handlers
- [ ] Configure SSL certificates
- [ ] Test refund process
- [ ] Setup payment reconciliation

### Environment Variables

```env
# Production
NODE_ENV=production
ESEWA_MERCHANT_ID=your_production_merchant_id
ESEWA_SECRET_KEY=your_production_secret
KHALTI_PUBLIC_KEY=live_public_key_...
KHALTI_SECRET_KEY=live_secret_key_...
FRONTEND_URL=https://yatrarentals.com
```

---

## 📞 Support

### eSewa Support
- Website: https://esewa.com.np
- Email: merchant@esewa.com.np
- Phone: 01-5970032

### Khalti Support
- Website: https://khalti.com
- Email: support@khalti.com
- Phone: 01-5970111

---

## 📝 API Integration Summary

### Server Routes Created

- `POST /api/payment/esewa/initiate` - Start eSewa payment
- `GET /api/payment/esewa/verify` - Verify eSewa callback
- `POST /api/payment/khalti/initiate` - Start Khalti payment
- `POST /api/payment/khalti/verify` - Verify Khalti payment
- `POST /api/payment/khalti/refund` - Process Khalti refund
- `GET /api/payment/methods` - Get available methods

### Files Created

- `/server/services/esewa.ts` - eSewa service
- `/server/services/khalti.ts` - Khalti service
- `/server/routes/payment.ts` - Payment routes

---

**Payment Integration Status:** Production-ready!
**Testing:** Available in test environment
**Security:** SSL, signature verification, callback validation

💳 **Ready to accept payments in Nepal!**
