import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './payment.entity';
import { User } from '../user/user.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { BkashPaymentDto, BkashExecutePaymentDto } from './dto/bkash-payment.dto';
import axios from 'axios';

@Injectable()
export class PaymentService {
  private readonly bkashConfig = {
    baseURL: process.env.BKASH_BASE_URL || 'https://tokenized.sandbox.bka.sh/v1.2.0-beta',
    username: process.env.BKASH_USERNAME,
    password: process.env.BKASH_PASSWORD,
    appKey: process.env.BKASH_APP_KEY,
    appSecret: process.env.BKASH_APP_SECRET,
  };

  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // Get bKash access token
  private async getBkashToken(): Promise<string> {
    try {
      const response = await axios.post(
        `${this.bkashConfig.baseURL}/tokenized/checkout/token/grant`,
        {
          app_key: this.bkashConfig.appKey,
          app_secret: this.bkashConfig.appSecret,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            username: this.bkashConfig.username,
            password: this.bkashConfig.password,
          },
        }
      );

      return response.data.id_token;
    } catch (error) {
      console.error('Error getting bKash token:', error.response?.data || error.message);
      throw new HttpException('Failed to initialize payment', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Create bKash payment
  async createBkashPayment(userId: number, paymentData: BkashPaymentDto) {
    try {
      const token = await this.getBkashToken();
      
      const response = await axios.post(
        `${this.bkashConfig.baseURL}/tokenized/checkout/create`,
        {
          mode: '0011',
          payerReference: `USER_${userId}`,
          callbackURL: `${process.env.FRONTEND_URL}/payment/callback`,
          amount: paymentData.amount.toString(),
          currency: 'BDT',
          intent: paymentData.intent,
          merchantInvoiceNumber: `INV_${Date.now()}_${userId}`,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
            'X-APP-Key': this.bkashConfig.appKey,
          },
        }
      );

      // Create payment record
      const payment = this.paymentRepository.create({
        userId,
        amount: paymentData.amount,
        tokens: paymentData.tokens,
        paymentMethod: 'bkash',
        transactionId: response.data.merchantInvoiceNumber,
        bkashTransactionId: response.data.paymentID,
        status: 'pending',
        paymentDetails: response.data,
      });

      await this.paymentRepository.save(payment);

      return {
        paymentID: response.data.paymentID,
        bkashURL: response.data.bkashURL,
        callbackURL: response.data.callbackURL,
        successCallbackURL: response.data.successCallbackURL,
        failureCallbackURL: response.data.failureCallbackURL,
        cancelledCallbackURL: response.data.cancelledCallbackURL,
        amount: paymentData.amount,
        tokens: paymentData.tokens,
        paymentRecord: payment,
      };
    } catch (error) {
      console.error('Error creating bKash payment:', error.response?.data || error.message);
      throw new HttpException('Failed to create payment', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Execute bKash payment
  async executeBkashPayment(userId: number, executeData: BkashExecutePaymentDto) {
    try {
      const token = await this.getBkashToken();
      
      const response = await axios.post(
        `${this.bkashConfig.baseURL}/tokenized/checkout/execute`,
        {
          paymentID: executeData.paymentID,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
            'X-APP-Key': this.bkashConfig.appKey,
          },
        }
      );

      // Find payment record
      const payment = await this.paymentRepository.findOne({
        where: { bkashTransactionId: executeData.paymentID, userId },
      });

      if (!payment) {
        throw new HttpException('Payment record not found', HttpStatus.NOT_FOUND);
      }

      if (response.data.statusCode === '0000') {
        // Payment successful
        payment.status = 'completed';
        payment.paymentDetails = { ...payment.paymentDetails, executeResponse: response.data };
        await this.paymentRepository.save(payment);

        // Add tokens to user account
        await this.userRepository.increment({ id: userId }, 'connectionTokens', payment.tokens);

        return {
          success: true,
          message: 'Payment completed successfully',
          transactionId: response.data.trxID,
          tokens: payment.tokens,
          payment,
        };
      } else {
        // Payment failed
        payment.status = 'failed';
        payment.paymentDetails = { ...payment.paymentDetails, executeResponse: response.data };
        await this.paymentRepository.save(payment);

        throw new HttpException('Payment execution failed', HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      console.error('Error executing bKash payment:', error.response?.data || error.message);
      throw new HttpException('Failed to execute payment', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Query bKash payment status
  async queryBkashPayment(paymentID: string) {
    try {
      const token = await this.getBkashToken();
      
      const response = await axios.post(
        `${this.bkashConfig.baseURL}/tokenized/checkout/payment/status`,
        {
          paymentID,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
            'X-APP-Key': this.bkashConfig.appKey,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error querying bKash payment:', error.response?.data || error.message);
      throw new HttpException('Failed to query payment status', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Get user's payment history
  async getUserPayments(userId: number) {
    return this.paymentRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  // Get user's token balance
  async getUserTokenBalance(userId: number): Promise<number> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    return user?.connectionTokens || 0;
  }

  // Admin: Get all payments
  async getAllPayments() {
    return this.paymentRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }
}