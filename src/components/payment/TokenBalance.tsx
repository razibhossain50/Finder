'use client';

import { useState, useEffect } from 'react';
import { Card, CardBody, Chip } from '@heroui/react';
import { Coins } from 'lucide-react';

interface TokenBalanceProps {
  userId?: number;
  onBalanceUpdate?: (balance: number) => void;
}

export const TokenBalance = ({ userId, onBalanceUpdate }: TokenBalanceProps) => {
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBalance();
  }, [userId]);

  const fetchBalance = async () => {
    try {
      const token = localStorage.getItem('regular_user_access_token');
      if (!token) return;

      const response = await fetch('/api/payments/tokens/balance', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBalance(data.balance);
        onBalanceUpdate?.(data.balance);
      }
    } catch (error) {
      console.error('Error fetching token balance:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardBody className="flex flex-row items-center gap-2">
          <Coins className="w-5 h-5 text-primary" />
          <span>Loading...</span>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardBody className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Coins className="w-5 h-5 text-primary" />
          <span className="font-medium">Connection Tokens</span>
        </div>
        <Chip 
          color={balance > 0 ? "success" : "warning"} 
          variant="flat"
          size="lg"
        >
          {balance}
        </Chip>
      </CardBody>
    </Card>
  );
};