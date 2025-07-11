import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { BiodataService } from './biodata.service';
import { CreateBiodataDto } from './dto/create-biodata.dto';
import { UpdateBiodataDto } from './dto/update-biodata.dto';

@Controller('api/biodatas')
export class BiodataController {
  constructor(private readonly biodataService: BiodataService) {}

  @Post()
  create(@Body() createBiodataDto: CreateBiodataDto) {
    return this.biodataService.create(createBiodataDto);
  }

  @Get()
  findAll() {
    return this.biodataService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.biodataService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBiodataDto: UpdateBiodataDto) {
    return this.biodataService.update(+id, updateBiodataDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.biodataService.remove(+id);
  }

  // For multi-step form: update step and partial data
  @Put(':id/step/:step')
  updateStep(
    @Param('id') id: string,
    @Param('step') step: string,
    @Body() partialData: UpdateBiodataDto,
  ) {
    return this.biodataService.updateStep(+id, +step, partialData);
  }
}
