import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../user/user.entity';
import { LoginDto } from './dto/login.dto';
import { AdminLoginDto } from './dto/admin-login.dto';
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
    const { fullName, mobile, password, confirmPassword } = createUserDto;

    if (password !== confirmPassword) {
      throw new BadRequestException('Password and confirm password do not match');
    }

    // Normalize mobile number (remove +88 if present, ensure it starts with 01)
    const normalizedMobile = this.normalizeMobile(mobile);

    const userExists = await this.usersRepository.findOne({ where: { mobile: normalizedMobile } });
    if (userExists) {
      throw new BadRequestException('Mobile number already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      fullName,
      mobile: normalizedMobile,
      password: hashedPassword,
      role: 'user'
    });

    const savedUser = await this.usersRepository.save(user);

    // Generate JWT token for immediate login after signup
    const payload = { id: savedUser.id, mobile: savedUser.mobile, role: savedUser.role };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: savedUser.id,
        fullName: savedUser.fullName,
        mobile: savedUser.mobile,
        role: savedUser.role
      }
    };
  }

  // Helper method to normalize mobile numbers
  private normalizeMobile(mobile: string): string {
    // Remove +88 if present and ensure it starts with 01
    const normalized = mobile.replace(/^\+88/, '');
    if (!normalized.startsWith('01')) {
      throw new BadRequestException('Mobile number must start with 01');
    }
    return normalized;
  }

  async validateUser(loginDto: LoginDto): Promise<AuthPayload> {
    const normalizedMobile = this.normalizeMobile(loginDto.mobile);
    const user = await this.usersRepository.findOne({ where: { mobile: normalizedMobile } });

    if (!user) {
      throw new UnauthorizedException('No account found with this mobile number. Please sign up first.');
    }

    if (!user.password) {
      throw new UnauthorizedException('This account was created with Google. Please use Google Sign-In.');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password. Please check your password and try again.');
    }

    return {
      id: user.id,
      mobile: user.mobile || '',
      role: user.role
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto);
    const payload = { id: user.id, mobile: user.mobile, role: user.role };

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
        mobile: user.mobile,
        role: user.role
      }
    };
  }

  // Admin authentication methods (email-based)
  async validateAdminUser(adminLoginDto: AdminLoginDto): Promise<AuthPayload> {
    const user = await this.usersRepository.findOne({ where: { email: adminLoginDto.email } });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user has admin or superadmin role
    if (user.role !== 'admin' && user.role !== 'superadmin') {
      throw new UnauthorizedException('Access denied. Admin privileges required.');
    }

    const isPasswordValid = await bcrypt.compare(adminLoginDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      id: user.id,
      mobile: user.mobile || '', // Admin users might not have mobile
      role: user.role
    };
  }

  async adminLogin(adminLoginDto: AdminLoginDto) {
    const user = await this.validateAdminUser(adminLoginDto);
    const payload = { id: user.id, mobile: user.mobile, role: user.role };

    console.log('=== ADMIN LOGIN DEBUG ===');
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
        email: fullUser?.email || null,
        mobile: user.mobile,
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
        profilePicture: googleUser.profilePicture,
        // Google users don't have mobile initially - can be added later
        mobile: undefined
      });

      user = await this.usersRepository.save(user);
    }

    return {
      id: user.id,
      mobile: user.mobile || '', // Empty string for Google users without mobile
      role: user.role
    };
  }

  async googleLogin(user: AuthPayload) {
    const payload = { id: user.id, mobile: user.mobile, role: user.role };
    const fullUser = await this.usersRepository.findOne({ where: { id: user.id } });

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        fullName: fullUser?.fullName || null,
        mobile: user.mobile,
        email: fullUser?.email || null,
        role: user.role
      }
    };
  }

  async createSuperAdmin() {
    try {
      // Create superadmin with mobile number
      const superAdminExists = await this.usersRepository.findOne({ where: { mobile: '01700000000' } });

      if (superAdminExists) {
        // Just update the password if account exists
        const hashedPassword = await bcrypt.hash('superadmin', 10);
        superAdminExists.password = hashedPassword;
        await this.usersRepository.save(superAdminExists);
        console.log('Superadmin password updated for 01700000000');
        return;
      }

      // Create new superadmin account with mobile
      const hashedPassword = await bcrypt.hash('superadmin', 10);
      const admin = this.usersRepository.create({
        mobile: '01700000000',
        email: 'superadmin@example.com',
        password: hashedPassword,
        role: 'superadmin',
        fullName: 'Super Admin'
      });

      await this.usersRepository.save(admin);
      console.log('New superadmin created: 01700000000 / superadmin');
    } catch (error) {
      console.error('Error in createSuperAdmin:', error.message);

      // Fallback: ensure we have at least one working superadmin
      try {
        const anySuperAdmin = await this.usersRepository.findOne({ where: { role: 'superadmin' } });
        if (!anySuperAdmin) {
          const hashedPassword = await bcrypt.hash('admin123', 10);
          const fallbackAdmin = this.usersRepository.create({
            mobile: '01700000001',
            email: 'admin@example.com',
            password: hashedPassword,
            role: 'superadmin',
            fullName: 'Super Admin'
          });
          await this.usersRepository.save(fallbackAdmin);
          console.log('Fallback superadmin created: 01700000001 / admin123');
        }
      } catch (fallbackError) {
        console.error('Failed to create fallback admin:', fallbackError.message);
      }
    }

    // Create a test regular user with mobile
    const testUserExists = await this.usersRepository.findOne({ where: { mobile: '01800000000' } });

    if (!testUserExists) {
      const hashedPassword = await bcrypt.hash('12345', 10);
      const testUser = this.usersRepository.create({
        mobile: '01800000000',
        email: 'user@example.com',
        password: hashedPassword,
        role: 'user',
        fullName: 'Test User'
      });

      await this.usersRepository.save(testUser);
      console.log('Test user created: 01800000000 / 12345');
    }

    // Create a test admin user with email (for admin login)
    const testAdminExists = await this.usersRepository.findOne({ where: { email: 'admin@example.com' } });

    if (!testAdminExists) {
      const hashedPassword = await bcrypt.hash('aaaaa', 10);
      const testAdmin = this.usersRepository.create({
        mobile: '01900000000',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
        fullName: 'Test Admin'
      });

      await this.usersRepository.save(testAdmin);
      console.log('Test admin created: admin@example.com / aaaaa (mobile: 01900000000)');
    }
  }
}
