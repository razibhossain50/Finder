import { IsString, MinLength, IsOptional, IsIn, IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe',
  })
  @IsString()
  fullName: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'john.doe@example.com',
  })
  @IsEmail({}, { message: 'Please enter a valid email address' })
  email: string;

  @ApiProperty({
    description: 'Password for the user account',
    example: 'password123',
    minLength: 5,
  })
  @IsString()
  @MinLength(5)
  password: string;

  @ApiProperty({
    description: 'Password confirmation',
    example: 'password123',
    minLength: 5,
  })
  @IsString()
  @MinLength(5)
  confirmPassword: string;

  @ApiPropertyOptional({
    description: 'User role',
    enum: ['user', 'admin', 'superadmin'],
    example: 'user',
  })
  @IsOptional()
  @IsString()
  @IsIn(['user', 'admin', 'superadmin'])
  role?: string;
}
