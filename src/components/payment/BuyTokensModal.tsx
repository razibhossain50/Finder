'use client';

import { useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Card,
  CardBody,
  Divider,
  Chip,
} from '@heroui/react';
import { Coins, CreditCard } from 'lucide-react';

interface BuyTokensModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const tokenPackages = [
  { tokens: 10, price: 100, popular: false },
  { tokens: 25, price: 200, popular: true, discount: '20% OFF' },
  { tokens: 50, price: 350, popular: false, discount: '30% OFF' },
  { tokens: 100, price: 600, popular: false, discount: '40% OFF' },
];

export const BuyTokensModal = ({ isOpen, onClose, onSuccess }: BuyTokensModalProps) => {
  const [selectedPackage, setSelectedPackage] = useState(tokenPackages[1]);
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('regular_user_access_token');
      if (!token) {
        alert('Please login to purchase tokens');
        return;
      }

      // Create bKash payment
      const response = await fetch('/api/payments/bkash/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: selectedPackage.price,
          tokens: selectedPackage.tokens,
          intent: 'sale',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Redirect to bKash payment page
        window.location.href = data.bkashURL;
      } else {
        const error = await response.text();
        alert('Failed to create payment: ' + error);
      }
    } catch (error) {
      console.error('Error creating payment:', error);
      alert('Failed to create payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="2xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Coins className="w-6 h-6 text-primary" />
            <span>Buy Connection Tokens</span>
          </div>
          <p className="text-sm text-default-500 font-normal">
            Purchase tokens to view biodata contact information
          </p>
        </ModalHeader>
        <ModalBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tokenPackages.map((pkg, index) => (
              <Card
                key={index}
                isPressable
                isHoverable
                className={`cursor-pointer transition-all ${
                  selectedPackage === pkg
                    ? 'ring-2 ring-primary border-primary'
                    : 'hover:border-primary/50'
                } ${pkg.popular ? 'border-primary' : ''}`}
                onPress={() => setSelectedPackage(pkg)}
              >
                <CardBody className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <Coins className="w-5 h-5 text-primary" />
                      <span className="font-semibold">{pkg.tokens} Tokens</span>
                    </div>
                    {pkg.popular && (
                      <Chip color="primary" size="sm" variant="flat">
                        Popular
                      </Chip>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl font-bold text-primary">
                      ৳{pkg.price}
                    </span>
                    {pkg.discount && (
                      <Chip color="success" size="sm" variant="flat">
                        {pkg.discount}
                      </Chip>
                    )}
                  </div>
                  
                  <p className="text-sm text-default-500">
                    ৳{(pkg.price / pkg.tokens).toFixed(1)} per token
                  </p>
                </CardBody>
              </Card>
            ))}
          </div>

          <Divider className="my-4" />

          <div className="space-y-3">
            <h4 className="font-semibold">Selected Package:</h4>
            <Card className="bg-primary/5 border-primary/20">
              <CardBody className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{selectedPackage.tokens} Connection Tokens</p>
                    <p className="text-sm text-default-500">
                      View {selectedPackage.tokens} biodata contact information
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">৳{selectedPackage.price}</p>
                    {selectedPackage.discount && (
                      <p className="text-sm text-success">{selectedPackage.discount}</p>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          <div className="bg-warning/10 p-3 rounded-lg">
            <p className="text-sm text-warning-600">
              <strong>Note:</strong> Tokens are non-refundable and will be used when you view biodata contact information.
            </p>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            Cancel
          </Button>
          <Button
            color="primary"
            onPress={handlePurchase}
            isLoading={loading}
            startContent={<CreditCard className="w-4 h-4" />}
          >
            Pay with bKash
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};