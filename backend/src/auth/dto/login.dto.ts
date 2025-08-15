import { IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @MinLength(8, { message: 'Username must be at least 8 characters long' })
  username: string;

  @IsString()
  @MinLength(1, { message: 'Password is required' })
  password: string;
}