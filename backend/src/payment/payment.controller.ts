import { Controller, Post, Get, Body, UseGuards, Param } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { BkashPaymentDto, BkashExecutePaymentDto } from './dto/bkash-payment.dto';

@Controller('api/payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('bkash/create')
  @UseGuards(JwtAuthGuard)
  async createBkashPayment(
    @Body() paymentData: BkashPaymentDto,
    @CurrentUser() user: any
  ) {
    return this.paymentService.createBkashPayment(user.id, paymentData);
  }

  @Post('bkash/execute')
  @UseGuards(JwtAuthGuard)
  async executeBkashPayment(
    @Body() executeData: BkashExecutePaymentDto,
    @CurrentUser() user: any
  ) {
    return this.paymentService.executeBkashPayment(user.id, executeData);
  }

  @Get('bkash/query/:paymentID')
  @UseGuards(JwtAuthGuard)
  async queryBkashPayment(@Param('paymentID') paymentID: string) {
    return this.paymentService.queryBkashPayment(paymentID);
  }

  @Get('history')
  @UseGuards(JwtAuthGuard)
  async getUserPayments(@CurrentUser() user: any) {
    return this.paymentService.getUserPayments(user.id);
  }

  @Get('tokens/balance')
  @UseGuards(JwtAuthGuard)
  async getTokenBalance(@CurrentUser() user: any) {
    const balance = await this.paymentService.getUserTokenBalance(user.id);
    return { balance };
  }

  @Get('admin/all')
  @UseGuards(JwtAuthGuard)
  async getAllPayments(@CurrentUser() user: any) {
    // Only superadmin can access all payments
    if (user.role !== 'superadmin') {
      throw new Error('Access denied: Only superadmin can view all payments');
    }
    return this.paymentService.getAllPayments();
  }
}