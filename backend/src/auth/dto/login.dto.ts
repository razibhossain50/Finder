import { IsString, MinLength, Matches } from 'class-validator';

export class LoginDto {
  @IsString()
  @Matches(/^(\+88)?01[3-9]\d{8}$/, { 
    message: 'Invalid mobile number format. Use: 01XXXXXXXXX or +8801XXXXXXXXX' 
  })
  mobile: string;

  @IsString()
  @MinLength(1, { message: 'Password is required' })
  password: string;
}