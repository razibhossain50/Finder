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

  // For multi-step form: update step and partial data
  async updateStep(id: number, step: number, partialData: UpdateBiodataDto) {
    await this.biodataRepository.update(id, { ...partialData, step });
    return this.findOne(id);
  }
}
