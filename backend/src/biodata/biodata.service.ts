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

  create(createBiodataDto: CreateBiodataDto) {
    const biodata = this.biodataRepository.create(createBiodataDto);
    return this.biodataRepository.save(biodata);
  }

  findAll() {
    return this.biodataRepository.find();
  }

  findOne(id: number) {
    return this.biodataRepository.findOneBy({ id });
  }

  update(id: number, updateBiodataDto: UpdateBiodataDto) {
    return this.biodataRepository.update(id, updateBiodataDto);
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
