import { IsNumber, IsString } from 'class-validator';

export class BkashPaymentDto {
  @IsNumber()
  amount: number;

  @IsNumber()
  tokens: number;

  @IsString()
  intent: string; // 'sale'
}

export class BkashExecutePaymentDto {
  @IsString()
  paymentID: string;
}