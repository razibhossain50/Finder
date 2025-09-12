import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  access_token: string;

  @ApiProperty({
    description: 'User information',
    example: {
      id: 1,
      email: 'user@example.com',
      firstName: 'John',
      lastName: 'Doe'
    }
  })
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export class LogoutResponseDto {
  @ApiProperty({
    description: 'Logout confirmation message',
    example: 'Logout successful'
  })
  message: string;
}