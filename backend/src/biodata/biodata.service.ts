import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Biodata } from './biodata.entity';
import { CreateBiodataDto } from './dto/create-biodata.dto';
import { UpdateBiodataDto } from './dto/update-biodata.dto';

@Injectable()
export class BiodataService {
  constructor(
    @InjectRepository(Biodata)
    private biodataRepository: Repository<Biodata>,
  ) {}

  create(createBiodataDto: CreateBiodataDto & { userId: number }) {
    const biodata = this.biodataRepository.create(createBiodataDto);
    return this.biodataRepository.save(biodata);
  }

  findAll() {
    return this.biodataRepository.find();
  }

  findOne(id: number) {
    return this.biodataRepository.findOneBy({ id });
  }

  findByUserId(userId: number) {
    return this.biodataRepository.findOne({ 
      where: { userId },
      relations: ['user']
    });
  }

  update(id: number, updateBiodataDto: UpdateBiodataDto) {
    return this.biodataRepository.update(id, updateBiodataDto);
  }

  async updateByUserId(userId: number, updateBiodataDto: UpdateBiodataDto) {
    try {
      console.log('=== updateByUserId called ===');
      console.log('userId:', userId);
      console.log('updateBiodataDto:', JSON.stringify(updateBiodataDto, null, 2));
      
      // First check if user has existing biodata
      const existingBiodata = await this.findByUserId(userId);
      console.log('existingBiodata found:', !!existingBiodata);
      
      if (existingBiodata) {
        // Update existing biodata
        console.log('Updating existing biodata with ID:', existingBiodata.id);
        await this.biodataRepository.update(existingBiodata.id, updateBiodataDto);
        const result = await this.findOne(existingBiodata.id);
        console.log('Update successful, returning result');
        return result;
      } else {
        // Create new biodata if none exists
        console.log('Creating new biodata');
        const biodata = this.biodataRepository.create({ ...updateBiodataDto, userId });
        const result = await this.biodataRepository.save(biodata);
        console.log('Create successful, returning result');
        return result;
      }
    } catch (error) {
      console.error('Error in updateByUserId:', error);
      console.error('Error stack:', error.stack);
      throw error;
    }
  }

  remove(id: number) {
    return this.biodataRepository.delete(id);
  }

  async searchBiodatas(filters: {
    gender?: string;
    maritalStatus?: string;
    location?: string;
    biodataNumber?: string;
    ageMin?: number;
    ageMax?: number;
    page?: number;
    limit?: number;
  }) {
    try {
      console.log('=== searchBiodatas called ===');
      console.log('filters:', JSON.stringify(filters, null, 2));

      const {
        gender,
        maritalStatus,
        location,
        biodataNumber,
        ageMin,
        ageMax,
        page = 1,
        limit = 6
      } = filters;

      // Build query with filters
      const queryBuilder = this.biodataRepository.createQueryBuilder('biodata')
        .leftJoinAndSelect('biodata.user', 'user')
        .where('biodata.status = :status', { status: 'completed' }); // Only show completed biodatas

      // Filter by biodata number (ID)
      if (biodataNumber) {
        queryBuilder.andWhere('biodata.id = :id', { id: parseInt(biodataNumber) });
      }

      // Filter by gender (biodataType)
      if (gender && gender !== 'all') {
        queryBuilder.andWhere('biodata.biodataType = :gender', { gender });
      }

      // Filter by marital status
      if (maritalStatus && maritalStatus !== 'all') {
        queryBuilder.andWhere('biodata.maritalStatus = :maritalStatus', { maritalStatus });
      }

      // Filter by location (search in present or permanent address)
      if (location) {
        queryBuilder.andWhere(
          '(biodata.presentCountry ILIKE :location OR biodata.presentDivision ILIKE :location OR biodata.presentZilla ILIKE :location OR biodata.permanentCountry ILIKE :location OR biodata.permanentDivision ILIKE :location OR biodata.permanentZilla ILIKE :location)',
          { location: `%${location}%` }
        );
      }

      // Filter by age range
      if (ageMin) {
        queryBuilder.andWhere('biodata.age >= :ageMin', { ageMin });
      }
      if (ageMax) {
        queryBuilder.andWhere('biodata.age <= :ageMax', { ageMax });
      }

      // Get total count for pagination
      const totalCount = await queryBuilder.getCount();

      // Apply pagination
      const skip = (page - 1) * limit;
      queryBuilder.skip(skip).take(limit);

      // Order by creation date (newest first)
      queryBuilder.orderBy('biodata.id', 'DESC');

      const biodatas = await queryBuilder.getMany();

      console.log(`Found ${biodatas.length} biodatas out of ${totalCount} total`);

      return {
        data: biodatas,
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit),
        },
      };
    } catch (error) {
      console.error('Error in searchBiodatas:', error);
      throw error;
    }
  }

  // For multi-step form: update step and partial data
  async updateStep(id: number, step: number, partialData: UpdateBiodataDto) {
    await this.biodataRepository.update(id, { ...partialData, step });
    return this.findOne(id);
  }
}
