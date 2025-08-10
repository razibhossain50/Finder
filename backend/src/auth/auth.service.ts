import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../user/user.entity';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../user/create-user.dto';
import { AuthPayload } from './interfaces/auth-payload.interface';

interface GoogleUser {
  googleId: string;
  email: string;
  fullName: string;
  profilePicture?: string;
  accessToken: string;
  refreshToken?: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService
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
      role: 'user'
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
        role: savedUser.role
      }
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
      role: user.role
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto);
    const payload = { id: user.id, email: user.email, role: user.role };

    console.log('=== LOGIN DEBUG ===');
    console.log('JWT_SECRET being used:', 'your-secret-key');
    console.log('Payload being signed:', payload);

    const fullUser = await this.usersRepository.findOne({ where: { id: user.id } });

    const token = this.jwtService.sign(payload);
    console.log('Generated token:', token);

    return {
      access_token: token,
      user: {
        id: user.id,
        fullName: fullUser?.fullName || null,
        email: user.email,
        role: user.role
      }
    };
  }

  async validateGoogleUser(googleUser: GoogleUser): Promise<AuthPayload> {
    let user = await this.usersRepository.findOne({ 
      where: [
        { email: googleUser.email },
        { googleId: googleUser.googleId }
      ]
    });

    if (user) {
      // Update existing user with Google ID if not present
      if (!user.googleId) {
        user.googleId = googleUser.googleId;
        await this.usersRepository.save(user);
      }
    } else {
      // Create new user from Google profile
      user = this.usersRepository.create({
        email: googleUser.email,
        fullName: googleUser.fullName,
        googleId: googleUser.googleId,
        role: 'user',
        // No password needed for Google users
        password: undefined,
        profilePicture: googleUser.profilePicture
      });

      user = await this.usersRepository.save(user);
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role
    };
  }

  async googleLogin(user: AuthPayload) {
    const payload = { id: user.id, email: user.email, role: user.role };
    const fullUser = await this.usersRepository.findOne({ where: { id: user.id } });

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        fullName: fullUser?.fullName || null,
        email: user.email,
        role: user.role
      }
    };
  }

  async createSuperAdmin() {
    try {
      // First, check if superadmin@example.com already exists
      const superAdminExists = await this.usersRepository.findOne({ where: { email: 'superadmin@example.com' } });

      if (superAdminExists) {
        // Just update the password if account exists
        const hashedPassword = await bcrypt.hash('superadmin', 10);
        superAdminExists.password = hashedPassword;
        await this.usersRepository.save(superAdminExists);
        console.log('Superadmin password updated for superadmin@example.com');
        return;
      }

      // Check if old admin@example.com exists
      const oldAdminExists = await this.usersRepository.findOne({ where: { email: 'admin@example.com' } });

      if (oldAdminExists) {
        // Update the old admin account credentials
        const hashedPassword = await bcrypt.hash('superadmin', 10);
        oldAdminExists.email = 'superadmin@example.com';
        oldAdminExists.password = hashedPassword;
        oldAdminExists.fullName = 'Super Admin';

        await this.usersRepository.save(oldAdminExists);
        console.log('Admin account migrated: admin@example.com → superadmin@example.com');
      } else {
        // Create new superadmin account
        const hashedPassword = await bcrypt.hash('superadmin', 10);
        const admin = this.usersRepository.create({
          email: 'superadmin@example.com',
          password: hashedPassword,
          role: 'superadmin',
          fullName: 'Super Admin'
        });

        await this.usersRepository.save(admin);
        console.log('New superadmin created: superadmin@example.com');
      }
    } catch (error) {
      console.error('Error in createSuperAdmin:', error.message);

      // Fallback: ensure we have at least one working superadmin
      try {
        const anySuperAdmin = await this.usersRepository.findOne({ where: { role: 'superadmin' } });
        if (!anySuperAdmin) {
          const hashedPassword = await bcrypt.hash('admin123', 10);
          const fallbackAdmin = this.usersRepository.create({
            email: 'admin@example.com',
            password: hashedPassword,
            role: 'superadmin',
            fullName: 'Super Admin'
          });
          await this.usersRepository.save(fallbackAdmin);
          console.log('Fallback superadmin created: admin@example.com / admin123');
        }
      } catch (fallbackError) {
        console.error('Failed to create fallback admin:', fallbackError.message);
      }
    }

    // Also create a test regular user
    const testUserExists = await this.usersRepository.findOne({ where: { email: 'user@example.com' } });

    if (!testUserExists) {
      const hashedPassword = await bcrypt.hash('12345', 10);
      const testUser = this.usersRepository.create({
        email: 'user@example.com',
        password: hashedPassword,
        role: 'user',
        fullName: 'Test User'
      });

      await this.usersRepository.save(testUser);
      console.log('Test user created');
    }

    // Create a test admin user
    const testAdminExists = await this.usersRepository.findOne({ where: { email: 'admin@example.com' } });

    if (!testAdminExists) {
      const hashedPassword = await bcrypt.hash('aaaaa', 10);
      const testAdmin = this.usersRepository.create({
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
        fullName: 'Test Admin'
      });

      await this.usersRepository.save(testAdmin);
      console.log('Test admin created: admin@example.com / aaaaa');
    }
  }
}
