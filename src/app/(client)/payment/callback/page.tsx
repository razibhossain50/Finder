'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardBody, Button, Spinner } from '@heroui/react';
import { CheckCircle, XCircle, ArrowLeft } from 'lucide-react';

export default function PaymentCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [message, setMessage] = useState('');
  const [tokens, setTokens] = useState(0);

  useEffect(() => {
    const paymentID = searchParams.get('paymentID');
    const status = searchParams.get('status');

    if (paymentID && status === 'success') {
      executePayment(paymentID);
    } else if (status === 'failure' || status === 'cancel') {
      setStatus('failed');
      setMessage('Payment was cancelled or failed');
    }
  }, [searchParams]);

  const executePayment = async (paymentID: string) => {
    try {
      const token = localStorage.getItem('regular_user_access_token');
      if (!token) {
        setStatus('failed');
        setMessage('Authentication required');
        return;
      }

      const response = await fetch('/api/payments/bkash/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ paymentID }),
      });

      if (response.ok) {
        const data = await response.json();
        setStatus('success');
        setMessage(data.message);
        setTokens(data.tokens);
      } else {
        const error = await response.text();
        setStatus('failed');
        setMessage('Payment execution failed: ' + error);
      }
    } catch (error) {
      console.error('Error executing payment:', error);
      setStatus('failed');
      setMessage('Payment execution failed');
    }
  };

  const handleGoBack = () => {
    router.push('/profile/settings');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardBody className="text-center p-8">
          {status === 'loading' && (
            <>
              <Spinner size="lg" className="mb-4" />
              <h2 className="text-xl font-semibold mb-2">Processing Payment</h2>
              <p className="text-default-500">
                Please wait while we confirm your payment...
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-success mb-2">
                Payment Successful!
              </h2>
              <p className="text-default-500 mb-4">{message}</p>
              <div className="bg-success/10 p-4 rounded-lg mb-6">
                <p className="text-success font-semibold">
                  {tokens} Connection Tokens Added
                </p>
                <p className="text-sm text-success/80">
                  You can now view biodata contact information
                </p>
              </div>
              <Button
                color="primary"
                onPress={handleGoBack}
                startContent={<ArrowLeft className="w-4 h-4" />}
              >
                Continue
              </Button>
            </>
          )}

          {status === 'failed' && (
            <>
              <XCircle className="w-16 h-16 text-danger mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-danger mb-2">
                Payment Failed
              </h2>
              <p className="text-default-500 mb-6">{message}</p>
              <Button
                color="primary"
                variant="light"
                onPress={handleGoBack}
                startContent={<ArrowLeft className="w-4 h-4" />}
              >
                Go Back
              </Button>
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
}