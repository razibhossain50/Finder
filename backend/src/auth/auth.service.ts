import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../user/user.entity';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../user/create-user.dto';
import { AuthPayload } from './interfaces/auth-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) { }

  async signup(createUserDto: CreateUserDto) {
    const { fullName, email, password, confirmPassword } = createUserDto;

    if (password !== confirmPassword) {
      throw new BadRequestException('Password and confirm password do not match');
    }

    const userExists = await this.usersRepository.findOne({ where: { email } });
    if (userExists) {
      throw new BadRequestException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      fullName,
      email,
      password: hashedPassword,
      role: 'user',
    });

    const savedUser = await this.usersRepository.save(user);
    
    // Generate JWT token for immediate login after signup
    const payload = { id: savedUser.id, email: savedUser.email, role: savedUser.role };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: savedUser.id,
        fullName: savedUser.fullName,
        email: savedUser.email,
        role: savedUser.role,
      },
    };
  }

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

    const fullUser = await this.usersRepository.findOne({ where: { id: user.id } });

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        fullName: fullUser?.fullName || null,
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