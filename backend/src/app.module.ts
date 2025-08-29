// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { User } from './user/user.entity';
import { Biodata } from './biodata/biodata.entity';
import { BiodataModule } from './biodata/biodata.module';
import { FavoritesModule } from './favorites/favorites.module';
import { Favorite } from './favorites/favorites.entity';
import { ProfileView } from './biodata/entities/profile-view.entity';
import { UploadModule } from './upload/upload.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST') || 'localhost',
        port: config.get<number>('DB_PORT') || 5432,
        username: config.get<string>('DB_USER') || 'postgres',
        password: config.get<string>('DB_PASS') || '12345',
        database: config.get<string>('DB_NAME') || 'finder',
        entities: [User, Biodata, Favorite, ProfileView],
        autoLoadEntities: true,
        synchronize: false, // Disabled - using migrations instead
        migrations: ['dist/migrations/*.js'],
        migrationsRun: false, // Set to true if you want auto-run migrations on startup
        logging: false, // Disable logging to reduce noise
        extra: {
          // Add connection pool settings
          max: 10,
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 2000,
        }
      }),
    }),
    UserModule,
    AuthModule,
    BiodataModule,
    FavoritesModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
