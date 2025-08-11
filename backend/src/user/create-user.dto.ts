import { IsString, MinLength, Matches, IsOptional, IsIn } from 'class-validator';

export class CreateUserDto {
  @IsString()
  fullName: string;

  @IsString()
  @Matches(/^(\+88)?01[3-9]\d{8}$/, { 
    message: 'Invalid mobile number format. Use: 01XXXXXXXXX or +8801XXXXXXXXX' 
  })
  mobile: string;

  @IsString()
  @MinLength(5)
  password: string;

  @IsString()
  @MinLength(5)
  confirmPassword: string;

  @IsOptional()
  @IsString()
  @IsIn(['user', 'admin', 'superadmin'])
  role?: string;
}
