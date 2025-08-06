'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Chip,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from '@heroui/react';
import { CreditCard, Calendar, Coins } from 'lucide-react';

interface Payment {
  id: number;
  amount: number;
  tokens: number;
  paymentMethod: string;
  transactionId: string;
  status: string;
  createdAt: string;
}

export const PaymentHistory = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem('regular_user_access_token');
      if (!token) return;

      const response = await fetch('/api/payments/history', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPayments(data);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'danger';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardBody className="text-center py-8">
          <div className="animate-pulse">Loading payment history...</div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Payment History</h3>
        </div>
      </CardHeader>
      <CardBody>
        {payments.length === 0 ? (
          <div className="text-center py-8">
            <CreditCard className="w-12 h-12 text-default-300 mx-auto mb-2" />
            <p className="text-default-500">No payments yet</p>
            <p className="text-sm text-default-400">
              Your payment history will appear here
            </p>
          </div>
        ) : (
          <Table aria-label="Payment history table">
            <TableHeader>
              <TableColumn>DATE</TableColumn>
              <TableColumn>AMOUNT</TableColumn>
              <TableColumn>TOKENS</TableColumn>
              <TableColumn>METHOD</TableColumn>
              <TableColumn>STATUS</TableColumn>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-default-400" />
                      <span className="text-sm">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold">৳{payment.amount}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Coins className="w-4 h-4 text-primary" />
                      <span>{payment.tokens}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Chip variant="flat" size="sm">
                      {payment.paymentMethod.toUpperCase()}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <Chip
                      color={getStatusColor(payment.status)}
                      variant="flat"
                      size="sm"
                    >
                      {payment.status.toUpperCase()}
                    </Chip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardBody>
    </Card>
  );
};