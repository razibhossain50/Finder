import { IsNumber, IsString, IsOptional } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  amount: number;

  @IsNumber()
  tokens: number;

  @IsString()
  paymentMethod: string;

  @IsString()
  @IsOptional()
  transactionId?: string;
}