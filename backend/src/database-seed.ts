import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

// Load environment variables
config();

const configService = new ConfigService();

// Create DataSource
const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get<string>('DB_HOST') || 'localhost',
  port: configService.get<number>('DB_PORT') || 5432,
  username: configService.get<string>('DB_USER') || 'postgres',
  password: configService.get<string>('DB_PASS') || '12345',
  database: configService.get<string>('DB_NAME') || 'finder',
  entities: ['src/**/*.entity.ts'],
  synchronize: false,
  logging: true,
});

// Import seed modules
import { seedUser } from './seeds/user';
import { seedBiodata } from './seeds/biodata';

// Seed data function (orchestrates per-seed files)
async function seedDatabase(dataSource: any) {
  try {
    await seedUser(dataSource);
    await seedBiodata(dataSource);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
}

// Main seed function
async function runDatabaseSeed() {
  try {
    console.log('🚀 Starting database seeding...');
    
    // Initialize connection
    console.log('🔄 Initializing database connection...');
    await AppDataSource.initialize();
    console.log('✅ Database connection established');

    // Run seed data
    console.log('🔄 Running seed data...');
    await seedDatabase(AppDataSource);
    
    console.log('🎉 Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    
    // If database doesn't exist, provide helpful error message
    if (error.code === '3D000') { // PostgreSQL error code for database does not exist
      console.log('📋 Database does not exist. Please create it manually or check your connection settings.');
      console.log('💡 You can create the database using:');
      console.log('   createdb -h localhost -U postgres finder');
    }
    
    process.exit(1);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('🔌 Database connection closed');
    }
  }
}

// Export for use in other files
export { AppDataSource, runDatabaseSeed, seedDatabase };

// Run if this file is executed directly
if (require.main === module) {
  runDatabaseSeed();
}
