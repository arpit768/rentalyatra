// Payment Routes for Backend API

import express from 'express';
import { esewaService } from '../services/esewa';
import { khaltiService } from '../services/khalti';

const router = express.Router();

// ==================== eSewa Routes ====================

/**
 * POST /api/payment/esewa/initiate
 * Initiate eSewa payment
 */
router.post('/esewa/initiate', async (req, res) => {
  try {
    const { amount, bookingId, customerName, customerEmail, customerPhone } = req.body;

    // Validate input
    if (!amount || !bookingId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const paymentData = {
      amount,
      taxAmount: 0,
      serviceCharge: 0,
      deliveryCharge: 0,
      productCode: bookingId,
      customerName,
      customerEmail,
      customerPhone,
    };

    const paymentForm = esewaService.generatePaymentForm(paymentData);

    res.json({
      success: true,
      paymentUrl: paymentForm.url,
      params: paymentForm.params,
    });
  } catch (error) {
    console.error('eSewa initiation error:', error);
    res.status(500).json({ error: 'Payment initiation failed' });
  }
});

/**
 * GET /api/payment/esewa/verify
 * Verify eSewa payment callback
 */
router.get('/esewa/verify', async (req, res) => {
  try {
    const { oid, amt, refId } = req.query;

    if (!oid || !amt || !refId) {
      return res.status(400).json({ error: 'Missing verification parameters' });
    }

    const verification = await esewaService.verifyPayment(
      oid as string,
      amt as string,
      refId as string
    );

    if (verification.status === 'SUCCESS') {
      // Update booking status in database
      // await updateBookingPayment(oid, verification);

      res.json({
        success: true,
        message: 'Payment verified successfully',
        data: verification,
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment verification failed',
        data: verification,
      });
    }
  } catch (error) {
    console.error('eSewa verification error:', error);
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

// ==================== Khalti Routes ====================

/**
 * POST /api/payment/khalti/initiate
 * Initiate Khalti payment
 */
router.post('/khalti/initiate', async (req, res) => {
  try {
    const { amount, bookingId, customerName, customerEmail, customerPhone } = req.body;

    // Validate input
    if (!amount || !bookingId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const returnUrl = `${process.env.FRONTEND_URL}/payment/khalti/callback`;

    const payment = await khaltiService.initiatePayment({
      amount,
      bookingId,
      customerName,
      customerEmail,
      customerPhone,
      returnUrl,
    });

    res.json({
      success: true,
      pidx: payment.pidx,
      paymentUrl: payment.payment_url,
      expiresAt: payment.expires_at,
    });
  } catch (error: any) {
    console.error('Khalti initiation error:', error);
    res.status(500).json({ error: error.message || 'Payment initiation failed' });
  }
});

/**
 * POST /api/payment/khalti/verify
 * Verify Khalti payment
 */
router.post('/khalti/verify', async (req, res) => {
  try {
    const { pidx } = req.body;

    if (!pidx) {
      return res.status(400).json({ error: 'Missing pidx parameter' });
    }

    const verification = await khaltiService.verifyPayment(pidx);

    if (verification.status === 'Completed') {
      // Update booking status in database
      // await updateBookingPayment(verification.transaction_id, verification);

      res.json({
        success: true,
        message: 'Payment verified successfully',
        data: {
          transactionId: verification.transaction_id,
          amount: verification.total_amount / 100, // Convert paisa to NPR
          status: verification.status,
          fee: verification.fee / 100,
        },
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment not completed',
        status: verification.status,
      });
    }
  } catch (error: any) {
    console.error('Khalti verification error:', error);
    res.status(500).json({ error: error.message || 'Payment verification failed' });
  }
});

/**
 * POST /api/payment/khalti/refund
 * Process Khalti refund
 */
router.post('/khalti/refund', async (req, res) => {
  try {
    const { pidx, amount } = req.body;

    if (!pidx) {
      return res.status(400).json({ error: 'Missing pidx parameter' });
    }

    const refund = await khaltiService.refundPayment(pidx, amount);

    res.json({
      success: true,
      message: 'Refund processed successfully',
      data: refund,
    });
  } catch (error: any) {
    console.error('Khalti refund error:', error);
    res.status(500).json({ error: error.message || 'Refund failed' });
  }
});

// ==================== Generic Routes ====================

/**
 * GET /api/payment/methods
 * Get available payment methods
 */
router.get('/methods', (req, res) => {
  res.json({
    methods: [
      {
        id: 'esewa',
        name: 'eSewa',
        description: "Nepal's leading digital wallet",
        logo: '/images/esewa-logo.png',
        enabled: !!process.env.ESEWA_MERCHANT_ID,
      },
      {
        id: 'khalti',
        name: 'Khalti',
        description: 'Fast & secure digital payments',
        logo: '/images/khalti-logo.png',
        enabled: !!process.env.KHALTI_SECRET_KEY,
      },
      {
        id: 'bank',
        name: 'Bank Transfer',
        description: 'Direct bank payment',
        logo: '/images/bank-logo.png',
        enabled: true,
      },
    ],
  });
});

export default router;
