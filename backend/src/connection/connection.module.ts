import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConnectionService } from './connection.service';
import { ConnectionController } from './connection.controller';
import { Connection } from './connection.entity';
import { User } from '../user/user.entity';
import { Biodata } from '../biodata/biodata.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Connection, User, Biodata])],
  controllers: [ConnectionController],
  providers: [ConnectionService],
  exports: [ConnectionService],
})
export class ConnectionModule {}