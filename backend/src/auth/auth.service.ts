import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../user/user.entity';
import { LoginDto } from './dto/login.dto';
import { AuthPayload } from './interfaces/auth-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) { }

  async validateUser(loginDto: LoginDto): Promise<AuthPayload> {
    const user = await this.usersRepository.findOne({ where: { email: loginDto.email } });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto);
    const payload = { id: user.id, email: user.email, role: user.role };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  async createSuperAdmin() {
    const adminExists = await this.usersRepository.findOne({ where: { email: 'admin@example.com' } });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('aaaaa', 10);
      const admin = this.usersRepository.create({
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'superadmin',
      });

      await this.usersRepository.save(admin);
      console.log('Superadmin created');
    }
  }
}