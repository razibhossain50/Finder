import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Connection } from './connection.entity';
import { User } from '../user/user.entity';
import { Biodata } from '../biodata/biodata.entity';

@Injectable()
export class ConnectionService {
  constructor(
    @InjectRepository(Connection)
    private connectionRepository: Repository<Connection>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Biodata)
    private biodataRepository: Repository<Biodata>,
  ) {}

  // Purchase biodata contact information
  async purchaseContact(userId: number, biodataId: number) {
    // Check if user has enough tokens
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (user.connectionTokens < 1) {
      throw new HttpException('Insufficient connection tokens', HttpStatus.BAD_REQUEST);
    }

    // Check if biodata exists and is active
    const biodata = await this.biodataRepository.findOne({
      where: { id: biodataId, status: 'Active' },
      relations: ['user'],
    });

    if (!biodata) {
      throw new HttpException('Biodata not found or inactive', HttpStatus.NOT_FOUND);
    }

    // Check if user is trying to buy their own biodata
    if (biodata.userId === userId) {
      throw new HttpException('Cannot purchase your own biodata contact', HttpStatus.BAD_REQUEST);
    }

    // Check if user already has access to this biodata
    const existingConnection = await this.connectionRepository.findOne({
      where: { buyerId: userId, biodataId, status: 'active' },
    });

    if (existingConnection) {
      throw new HttpException('You already have access to this biodata contact', HttpStatus.BAD_REQUEST);
    }

    // Create connection and deduct token
    const connection = this.connectionRepository.create({
      buyerId: userId,
      biodataId,
      tokensUsed: 1,
      status: 'active',
    });

    await this.connectionRepository.save(connection);

    // Deduct token from user
    await this.userRepository.decrement({ id: userId }, 'connectionTokens', 1);

    return {
      success: true,
      message: 'Contact information purchased successfully',
      connection,
      contactInfo: {
        email: biodata.email,
        ownMobile: biodata.ownMobile,
        guardianMobile: biodata.guardianMobile,
      },
    };
  }

  // Check if user has access to biodata contact
  async hasContactAccess(userId: number, biodataId: number): Promise<boolean> {
    // Check if it's user's own biodata
    const biodata = await this.biodataRepository.findOne({
      where: { id: biodataId },
    });

    if (biodata?.userId === userId) {
      return true; // User can see their own contact info
    }

    // Check if user has purchased access
    const connection = await this.connectionRepository.findOne({
      where: { buyerId: userId, biodataId, status: 'active' },
    });

    return !!connection;
  }

  // Get user's purchased connections
  async getUserConnections(userId: number) {
    return this.connectionRepository.find({
      where: { buyerId: userId, status: 'active' },
      relations: ['biodata', 'biodata.user'],
      order: { createdAt: 'DESC' },
    });
  }

  // Get biodata contact info (only if user has access)
  async getBiodataContact(userId: number, biodataId: number) {
    const hasAccess = await this.hasContactAccess(userId, biodataId);
    
    if (!hasAccess) {
      throw new HttpException('Access denied. Purchase contact information first.', HttpStatus.FORBIDDEN);
    }

    const biodata = await this.biodataRepository.findOne({
      where: { id: biodataId },
      select: ['id', 'email', 'ownMobile', 'guardianMobile', 'fullName'],
    });

    if (!biodata) {
      throw new HttpException('Biodata not found', HttpStatus.NOT_FOUND);
    }

    return {
      id: biodata.id,
      fullName: biodata.fullName,
      email: biodata.email,
      ownMobile: biodata.ownMobile,
      guardianMobile: biodata.guardianMobile,
    };
  }

  // Admin: Get all connections
  async getAllConnections() {
    return this.connectionRepository.find({
      relations: ['buyer', 'biodata', 'biodata.user'],
      order: { createdAt: 'DESC' },
    });
  }

  // Get connection statistics
  async getConnectionStats(userId?: number) {
    if (userId) {
      // User-specific stats
      const totalPurchased = await this.connectionRepository.count({
        where: { buyerId: userId, status: 'active' },
      });

      const user = await this.userRepository.findOne({ where: { id: userId } });
      const remainingTokens = user?.connectionTokens || 0;

      return {
        totalPurchased,
        remainingTokens,
      };
    } else {
      // Global stats (for admin)
      const totalConnections = await this.connectionRepository.count();
      const activeConnections = await this.connectionRepository.count({
        where: { status: 'active' },
      });

      return {
        totalConnections,
        activeConnections,
      };
    }
  }
}