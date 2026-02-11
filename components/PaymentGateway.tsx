import { useState } from 'react';
import { CreditCard, CheckCircle, Loader2, AlertCircle } from 'lucide-react';

export type PaymentMethod = 'esewa' | 'khalti' | 'bank';

interface PaymentGatewayProps {
  amount: number;
  bookingId: string;
  onSuccess: (paymentId: string, method: PaymentMethod) => void;
  onCancel: () => void;
}

export default function PaymentGateway({
  amount,
  bookingId,
  onSuccess,
  onCancel,
}: PaymentGatewayProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [processing, setProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Mock payment processing
  const processPayment = async (method: PaymentMethod) => {
    setProcessing(true);
    setPaymentStatus('processing');
    setErrorMessage('');

    try {
      // Simulate API call to payment gateway
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate success (90% success rate)
      const isSuccess = Math.random() > 0.1;

      if (isSuccess) {
        const paymentId = `PAY_${method.toUpperCase()}_${Date.now()}`;
        setPaymentStatus('success');

        // Wait a moment to show success message
        setTimeout(() => {
          onSuccess(paymentId, method);
        }, 1500);
      } else {
        throw new Error('Payment declined by gateway');
      }
    } catch (error) {
      setPaymentStatus('failed');
      setErrorMessage(error instanceof Error ? error.message : 'Payment failed');
      setProcessing(false);
    }
  };

  const handlePayment = () => {
    if (!selectedMethod) {
      alert('Please select a payment method');
      return;
    }
    processPayment(selectedMethod);
  };

  if (paymentStatus === 'success') {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
        <p className="text-gray-600 mb-4">
          Your booking has been confirmed. You will receive a confirmation email shortly.
        </p>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-green-800">
            <span className="font-semibold">Amount Paid:</span> NPR {amount.toLocaleString()}
          </p>
          <p className="text-sm text-green-800">
            <span className="font-semibold">Method:</span> {selectedMethod?.toUpperCase()}
          </p>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'processing') {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 text-center">
        <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing Payment...</h2>
        <p className="text-gray-600">
          Please wait while we process your {selectedMethod?.toUpperCase()} payment.
        </p>
        <p className="text-sm text-gray-500 mt-2">Do not close this window.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Complete Payment</h2>

      {/* Amount Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-gray-700 font-medium">Total Amount</span>
          <span className="text-2xl font-bold text-blue-600">NPR {amount.toLocaleString()}</span>
        </div>
        <p className="text-sm text-gray-600 mt-1">Booking ID: {bookingId}</p>
      </div>

      {/* Payment Methods */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Payment Method</h3>

        <div className="space-y-3">
          {/* eSewa */}
          <button
            onClick={() => setSelectedMethod('esewa')}
            className={`w-full p-4 border-2 rounded-lg transition-all ${
              selectedMethod === 'esewa'
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xl">eSewa</span>
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-gray-900">eSewa</p>
                <p className="text-sm text-gray-600">Nepal's leading digital wallet</p>
              </div>
              {selectedMethod === 'esewa' && (
                <CheckCircle className="w-6 h-6 text-green-600" />
              )}
            </div>
          </button>

          {/* Khalti */}
          <button
            onClick={() => setSelectedMethod('khalti')}
            className={`w-full p-4 border-2 rounded-lg transition-all ${
              selectedMethod === 'khalti'
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xl">Khalti</span>
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-gray-900">Khalti</p>
                <p className="text-sm text-gray-600">Fast & secure digital payments</p>
              </div>
              {selectedMethod === 'khalti' && (
                <CheckCircle className="w-6 h-6 text-purple-600" />
              )}
            </div>
          </button>

          {/* Bank Transfer */}
          <button
            onClick={() => setSelectedMethod('bank')}
            className={`w-full p-4 border-2 rounded-lg transition-all ${
              selectedMethod === 'bank'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-gray-900">Bank Transfer</p>
                <p className="text-sm text-gray-600">Direct bank payment</p>
              </div>
              {selectedMethod === 'bank' && (
                <CheckCircle className="w-6 h-6 text-blue-600" />
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {paymentStatus === 'failed' && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900">Payment Failed</p>
              <p className="text-sm text-red-700 mt-1">{errorMessage}</p>
              <button
                onClick={() => {
                  setPaymentStatus('idle');
                  setErrorMessage('');
                }}
                className="text-sm text-red-600 hover:text-red-800 font-medium mt-2"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Info */}
      {selectedMethod && (
        <div className="mb-6 bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-700 mb-2">
            <span className="font-semibold">Selected Method:</span> {selectedMethod.toUpperCase()}
          </p>
          <p className="text-xs text-gray-600">
            {selectedMethod === 'esewa' && 'You will be redirected to eSewa to complete your payment securely.'}
            {selectedMethod === 'khalti' && 'You will be redirected to Khalti to complete your payment securely.'}
            {selectedMethod === 'bank' && 'Enter your bank details to complete the transfer.'}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={onCancel}
          disabled={processing}
          className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handlePayment}
          disabled={!selectedMethod || processing}
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {processing ? 'Processing...' : `Pay NPR ${amount.toLocaleString()}`}
        </button>
      </div>

      {/* Security Notice */}
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          🔒 Your payment information is encrypted and secure
        </p>
      </div>
    </div>
  );
}

// Quick Payment Button Component
export function QuickPayButton({
  amount,
  onPaymentClick,
}: {
  amount: number;
  onPaymentClick: () => void;
}) {
  return (
    <button
      onClick={onPaymentClick}
      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
    >
      <CreditCard className="w-5 h-5" />
      <span>Pay NPR {amount.toLocaleString()}</span>
    </button>
  );
}
