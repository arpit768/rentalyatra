// Khalti Payment Gateway Integration
// Official docs: https://docs.khalti.com/

interface KhaltiConfig {
  publicKey: string;
  secretKey: string;
  apiUrl: string;
}

interface KhaltiPaymentPayload {
  return_url: string;
  website_url: string;
  amount: number; // In paisa (1 NPR = 100 paisa)
  purchase_order_id: string;
  purchase_order_name: string;
  customer_info: {
    name: string;
    email: string;
    phone: string;
  };
  amount_breakdown?: {
    label: string;
    amount: number;
  }[];
  product_details?: {
    identity: string;
    name: string;
    total_price: number;
    quantity: number;
    unit_price: number;
  }[];
}

interface KhaltiPaymentResponse {
  pidx: string; // Payment Index
  payment_url: string;
  expires_at: string;
  expires_in: number;
}

interface KhaltiVerificationResponse {
  pidx: string;
  total_amount: number;
  status: 'Completed' | 'Pending' | 'Refunded' | 'Failed';
  transaction_id: string;
  fee: number;
  refunded: boolean;
}

class KhaltiService {
  private config: KhaltiConfig;

  constructor() {
    this.config = {
      publicKey: process.env.KHALTI_PUBLIC_KEY || '',
      secretKey: process.env.KHALTI_SECRET_KEY || '',
      apiUrl: process.env.NODE_ENV === 'production'
        ? 'https://khalti.com/api/v2'
        : 'https://a.khalti.com/api/v2', // Test environment
    };
  }

  /**
   * Initialize payment
   */
  async initiatePayment(paymentData: {
    amount: number; // In NPR
    bookingId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    returnUrl: string;
  }): Promise<KhaltiPaymentResponse> {
    try {
      const payload: KhaltiPaymentPayload = {
        return_url: paymentData.returnUrl,
        website_url: process.env.FRONTEND_URL || 'http://localhost:3000',
        amount: paymentData.amount * 100, // Convert to paisa
        purchase_order_id: paymentData.bookingId,
        purchase_order_name: `Booking #${paymentData.bookingId}`,
        customer_info: {
          name: paymentData.customerName,
          email: paymentData.customerEmail,
          phone: paymentData.customerPhone,
        },
      };

      const response = await fetch(`${this.config.apiUrl}/epayment/initiate/`, {
        method: 'POST',
        headers: {
          'Authorization': `Key ${this.config.secretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Khalti payment initiation failed');
      }

      const data = await response.json();
      return data as KhaltiPaymentResponse;
    } catch (error) {
      console.error('Khalti payment initiation failed:', error);
      throw error;
    }
  }

  /**
   * Verify payment after callback
   */
  async verifyPayment(pidx: string): Promise<KhaltiVerificationResponse> {
    try {
      const response = await fetch(`${this.config.apiUrl}/epayment/lookup/`, {
        method: 'POST',
        headers: {
          'Authorization': `Key ${this.config.secretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pidx }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Khalti verification failed');
      }

      const data = await response.json();
      return data as KhaltiVerificationResponse;
    } catch (error) {
      console.error('Khalti verification failed:', error);
      throw error;
    }
  }

  /**
   * Process refund
   */
  async refundPayment(pidx: string, amount?: number): Promise<any> {
    try {
      const payload: any = { pidx };
      if (amount) {
        payload.amount = amount * 100; // Partial refund in paisa
      }

      const response = await fetch(`${this.config.apiUrl}/epayment/refund/`, {
        method: 'POST',
        headers: {
          'Authorization': `Key ${this.config.secretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Khalti refund failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Khalti refund failed:', error);
      throw error;
    }
  }

  /**
   * Get transaction status
   */
  async getTransactionStatus(pidx: string): Promise<KhaltiVerificationResponse> {
    return this.verifyPayment(pidx);
  }
}

export const khaltiService = new KhaltiService();
export default khaltiService;
