'use client';

import { useState } from 'react';
import {
  Card,
  CardBody,
  Button,
  Divider,
  Chip,
  useDisclosure,
} from '@heroui/react';
import { 
  Phone, 
  Mail, 
  Lock, 
  Unlock, 
  Eye,
  Coins,
  CreditCard 
} from 'lucide-react';
import { BuyTokensModal } from '../payment/BuyTokensModal';

interface ContactInfo {
  email?: string;
  ownMobile?: string;
  guardianMobile?: string;
  fullName?: string;
}

interface ContactInfoCardProps {
  biodataId: number;
  contactInfo?: ContactInfo;
  hasAccess: boolean;
  userTokens: number;
  onAccessGranted?: () => void;
}

export const ContactInfoCard = ({ 
  biodataId, 
  contactInfo, 
  hasAccess, 
  userTokens,
  onAccessGranted 
}: ContactInfoCardProps) => {
  const [loading, setLoading] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handlePurchaseAccess = async () => {
    if (userTokens < 1) {
      onOpen(); // Open buy tokens modal
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('regular_user_access_token');
      if (!token) {
        alert('Please login to purchase contact access');
        return;
      }

      const response = await fetch(`/api/connections/purchase/${biodataId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setShowContact(true);
        onAccessGranted?.();
        alert('Contact information purchased successfully!');
      } else {
        const error = await response.text();
        alert('Failed to purchase contact access: ' + error);
      }
    } catch (error) {
      console.error('Error purchasing contact access:', error);
      alert('Failed to purchase contact access');
    } finally {
      setLoading(false);
    }
  };

  const handleViewContact = async () => {
    if (!hasAccess) {
      handlePurchaseAccess();
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('regular_user_access_token');
      if (!token) return;

      const response = await fetch(`/api/connections/contact/${biodataId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setShowContact(true);
      }
    } catch (error) {
      console.error('Error fetching contact info:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card className="w-full">
        <CardBody className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              {hasAccess || showContact ? (
                <Unlock className="w-5 h-5 text-success" />
              ) : (
                <Lock className="w-5 h-5 text-warning" />
              )}
              Contact Information
            </h3>
            {hasAccess && (
              <Chip color="success" variant="flat" size="sm">
                Access Granted
              </Chip>
            )}
          </div>

          {(hasAccess && showContact) || (contactInfo && !contactInfo.email && !contactInfo.ownMobile) ? (
            // Show actual contact information
            <div className="space-y-4">
              {contactInfo?.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-default-500">Email</p>
                    <p className="font-medium">{contactInfo.email}</p>
                  </div>
                </div>
              )}
              
              {contactInfo?.ownMobile && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-default-500">Own Mobile</p>
                    <p className="font-medium">{contactInfo.ownMobile}</p>
                  </div>
                </div>
              )}
              
              {contactInfo?.guardianMobile && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-default-500">Guardian Mobile</p>
                    <p className="font-medium">{contactInfo.guardianMobile}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Show premium access required
            <div className="text-center py-8">
              <div className="mb-4">
                <Lock className="w-12 h-12 text-warning mx-auto mb-2" />
                <h4 className="font-semibold text-lg mb-2">Premium Contact Information</h4>
                <p className="text-default-500 mb-4">
                  Contact details are protected. Purchase access to view email and phone numbers.
                </p>
              </div>

              <Divider className="my-4" />

              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-primary" />
                  <span className="text-sm">Cost: 1 Token</span>
                </div>
                <div className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-success" />
                  <span className="text-sm">Your Balance: {userTokens}</span>
                </div>
              </div>

              {userTokens >= 1 ? (
                <Button
                  color="primary"
                  size="lg"
                  onPress={handleViewContact}
                  isLoading={loading}
                  startContent={<Eye className="w-4 h-4" />}
                >
                  View Contact Info (1 Token)
                </Button>
              ) : (
                <div className="space-y-3">
                  <p className="text-warning text-sm">
                    Insufficient tokens. Purchase tokens to view contact information.
                  </p>
                  <Button
                    color="warning"
                    size="lg"
                    onPress={onOpen}
                    startContent={<CreditCard className="w-4 h-4" />}
                  >
                    Buy Tokens
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardBody>
      </Card>

      <BuyTokensModal 
        isOpen={isOpen} 
        onClose={onClose}
        onSuccess={() => {
          onClose();
          // Refresh the page or update token balance
          window.location.reload();
        }}
      />
    </>
  );
};