import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Biodata } from './biodata.entity';
import { ProfileView } from './entities/profile-view.entity';
import { Connection } from '../connection/connection.entity';
import { BiodataService } from './biodata.service';
import { BiodataController } from './biodata.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Biodata, ProfileView, Connection])],
  providers: [BiodataService],
  controllers: [BiodataController],
  exports: [BiodataService],
})
export class BiodataModule {}
