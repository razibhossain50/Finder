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
    const { fullName, username, password, confirmPassword } = createUserDto;

    if (password !== confirmPassword) {
      throw new BadRequestException('Password and confirm password do not match');
    }

    // Validate username length
    if (username.length < 8) {
      throw new BadRequestException('Username must be at least 8 characters long');
    }

    const userExists = await this.usersRepository.findOne({ where: { username } });
    if (userExists) {
      throw new BadRequestException('Username already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      fullName,
      username,
      password: hashedPassword,
      role: 'user'
    });

    const savedUser = await this.usersRepository.save(user);

    // Generate JWT token for immediate login after signup
    const payload = { id: savedUser.id, username: savedUser.username, role: savedUser.role };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: savedUser.id,
        fullName: savedUser.fullName,
        username: savedUser.username,
        role: savedUser.role
      }
    };
  }

  async validateUser(loginDto: LoginDto): Promise<AuthPayload> {
    const user = await this.usersRepository.findOne({ where: { username: loginDto.username } });

    if (!user) {
      throw new UnauthorizedException('No account found with this username. Please sign up first.');
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
      username: user.username || '',
      role: user.role
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto);
    const payload = { id: user.id, username: user.username, role: user.role };

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
        username: user.username,
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
      username: user.username || '', // Admin users might not have username
      role: user.role
    };
  }

  async adminLogin(adminLoginDto: AdminLoginDto) {
    const user = await this.validateAdminUser(adminLoginDto);
    const payload = { id: user.id, username: user.username, role: user.role };

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
        username: user.username,
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
      // Generate a unique username for Google users based on email
      const baseUsername = googleUser.email.split('@')[0];
      let username = baseUsername.length >= 8 ? baseUsername : `${baseUsername}${Date.now()}`;
      
      // Ensure username is unique
      let existingUser = await this.usersRepository.findOne({ where: { username } });
      let counter = 1;
      while (existingUser) {
        username = `${baseUsername}${counter}`;
        if (username.length < 8) {
          username = `${baseUsername}${Date.now()}${counter}`;
        }
        existingUser = await this.usersRepository.findOne({ where: { username } });
        counter++;
      }

      // Create new user from Google profile
      user = this.usersRepository.create({
        email: googleUser.email,
        fullName: googleUser.fullName,
        username: username,
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
      username: user.username || '', // Empty string for Google users without username
      role: user.role
    };
  }

  async googleLogin(user: AuthPayload) {
    const payload = { id: user.id, username: user.username, role: user.role };
    const fullUser = await this.usersRepository.findOne({ where: { id: user.id } });

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        fullName: fullUser?.fullName || null,
        username: user.username,
        email: fullUser?.email || null,
        role: user.role
      }
    };
  }

  async createSuperAdmin() {
    try {
      // Create superadmin with username
      const superAdminExists = await this.usersRepository.findOne({ where: { username: 'superadmin' } });

      if (superAdminExists) {
        // Just update the password if account exists
        const hashedPassword = await bcrypt.hash('superadmin', 10);
        superAdminExists.password = hashedPassword;
        await this.usersRepository.save(superAdminExists);
        console.log('Superadmin password updated for username: superadmin');
        return;
      }

      // Create new superadmin account with username
      const hashedPassword = await bcrypt.hash('superadmin', 10);
      const admin = this.usersRepository.create({
        username: 'superadmin',
        email: 'superadmin@example.com',
        password: hashedPassword,
        role: 'superadmin',
        fullName: 'Super Admin'
      });

      await this.usersRepository.save(admin);
      console.log('New superadmin created: superadmin / superadmin');
    } catch (error) {
      console.error('Error in createSuperAdmin:', error.message);

      // Fallback: ensure we have at least one working superadmin
      try {
        const anySuperAdmin = await this.usersRepository.findOne({ where: { role: 'superadmin' } });
        if (!anySuperAdmin) {
          const hashedPassword = await bcrypt.hash('admin123', 10);
          const fallbackAdmin = this.usersRepository.create({
            username: 'adminuser',
            email: 'admin@example.com',
            password: hashedPassword,
            role: 'superadmin',
            fullName: 'Super Admin'
          });
          await this.usersRepository.save(fallbackAdmin);
          console.log('Fallback superadmin created: adminuser / admin123');
        }
      } catch (fallbackError) {
        console.error('Failed to create fallback admin:', fallbackError.message);
      }
    }

    // Create a test regular user with username
    const testUserExists = await this.usersRepository.findOne({ where: { username: 'testuser1' } });

    if (!testUserExists) {
      const hashedPassword = await bcrypt.hash('12345', 10);
      const testUser = this.usersRepository.create({
        username: 'testuser1',
        email: 'user@example.com',
        password: hashedPassword,
        role: 'user',
        fullName: 'Test User'
      });

      await this.usersRepository.save(testUser);
      console.log('Test user created: testuser1 / 12345');
    }

    // Create a test admin user with email (for admin login)
    const testAdminExists = await this.usersRepository.findOne({ where: { email: 'admin@example.com' } });

    if (!testAdminExists) {
      const hashedPassword = await bcrypt.hash('aaaaa', 10);
      const testAdmin = this.usersRepository.create({
        username: 'testadmin',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
        fullName: 'Test Admin'
      });

      await this.usersRepository.save(testAdmin);
      console.log('Test admin created: admin@example.com / aaaaa (username: testadmin)');
    }
  }
}
