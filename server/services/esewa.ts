// eSewa Payment Gateway Integration
// Official docs: https://developer.esewa.com.np/

import crypto from 'crypto';

interface EsewaConfig {
  merchantId: string;
  merchantSecret: string;
  successUrl: string;
  failureUrl: string;
  apiUrl: string;
}

interface EsewaPaymentData {
  amount: number;
  taxAmount: number;
  serviceCharge: number;
  deliveryCharge: number;
  productCode: string; // Booking ID
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

interface EsewaVerificationResponse {
  transactionId: string;
  refId: string;
  amount: number;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
}

class EsewaService {
  private config: EsewaConfig;

  constructor() {
    this.config = {
      merchantId: process.env.ESEWA_MERCHANT_ID || '',
      merchantSecret: process.env.ESEWA_SECRET_KEY || '',
      successUrl: process.env.ESEWA_SUCCESS_URL || 'http://localhost:3000/payment/success',
      failureUrl: process.env.ESEWA_FAILURE_URL || 'http://localhost:3000/payment/failure',
      apiUrl: process.env.NODE_ENV === 'production'
        ? 'https://esewa.com.np/epay/main'
        : 'https://uat.esewa.com.np/epay/main', // UAT for testing
    };
  }

  /**
   * Generate payment form data for eSewa
   */
  generatePaymentForm(paymentData: EsewaPaymentData): {
    url: string;
    params: Record<string, string>;
  } {
    const totalAmount = paymentData.amount +
      paymentData.taxAmount +
      paymentData.serviceCharge +
      paymentData.deliveryCharge;

    const params = {
      amt: paymentData.amount.toString(),
      txAmt: paymentData.taxAmount.toString(),
      psc: paymentData.serviceCharge.toString(),
      pdc: paymentData.deliveryCharge.toString(),
      tAmt: totalAmount.toString(),
      pid: paymentData.productCode,
      scd: this.config.merchantId,
      su: this.config.successUrl,
      fu: this.config.failureUrl,
    };

    return {
      url: this.config.apiUrl,
      params,
    };
  }

  /**
   * Verify payment after callback
   */
  async verifyPayment(
    oid: string,
    amt: string,
    refId: string
  ): Promise<EsewaVerificationResponse> {
    try {
      const verificationUrl = process.env.NODE_ENV === 'production'
        ? 'https://esewa.com.np/epay/transrec'
        : 'https://uat.esewa.com.np/epay/transrec';

      const params = new URLSearchParams({
        amt,
        rid: refId,
        pid: oid,
        scd: this.config.merchantId,
      });

      const response = await fetch(`${verificationUrl}?${params.toString()}`);
      const xmlText = await response.text();

      // Parse eSewa XML response
      const statusMatch = xmlText.match(/<response_code>(.*?)<\/response_code>/);
      const status = statusMatch?.[1];

      if (status === 'Success') {
        return {
          transactionId: oid,
          refId,
          amount: parseFloat(amt),
          status: 'SUCCESS',
        };
      } else {
        return {
          transactionId: oid,
          refId,
          amount: parseFloat(amt),
          status: 'FAILED',
        };
      }
    } catch (error) {
      console.error('eSewa verification failed:', error);
      throw new Error('Payment verification failed');
    }
  }

  /**
   * Generate payment signature for security
   */
  generateSignature(data: string): string {
    return crypto
      .createHmac('sha256', this.config.merchantSecret)
      .update(data)
      .digest('hex');
  }

  /**
   * Verify callback signature
   */
  verifySignature(data: string, signature: string): boolean {
    const expectedSignature = this.generateSignature(data);
    return expectedSignature === signature;
  }
}

export const esewaService = new EsewaService();
export default esewaService;
