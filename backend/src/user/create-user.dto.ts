import { IsString, MinLength, IsOptional, IsIn } from 'class-validator';

export class CreateUserDto {
  @IsString()
  fullName: string;

  @IsString()
  @MinLength(8, { message: 'Username must be at least 8 characters long' })
  username: string;

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

  @IsOptional()
  @IsString()
  recaptchaToken?: string;
}
