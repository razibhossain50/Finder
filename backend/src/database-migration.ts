import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

// Load environment variables
config();

const configService = new ConfigService();

// Create DataSource
const dbHost = configService.get<string>('DB_HOST') || 'localhost';
const dbPort = configService.get<number>('DB_PORT') || 5432;
const dbUser = configService.get<string>('DB_USER') || 'postgres';
const dbPass = configService.get<string>('DB_PASS') || '12345';
const dbName = configService.get<string>('DB_NAME') || 'finder';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: dbHost,
  port: dbPort,
  username: dbUser,
  password: dbPass,
  database: dbName,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  logging: true,
});

// Import migration classes (split into individual files)
import { CreateEnums } from './migrations/enums';
import { CreateUserTable } from './migrations/user';
import { CreateBiodataTable } from './migrations/biodata';
import { CreateFavoritesTable } from './migrations/favorites';
import { CreateProfileViewsTable } from './migrations/profile_views';

// Main orchestrator class
class MainOrchestrator {
  name = 'MainOrchestrator';

  async up(queryRunner: any): Promise<void> {
    console.log('🚀 Starting main migration orchestrator...');

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "migrations" (
        "id" SERIAL NOT NULL,
        "timestamp" bigint NOT NULL,
        "name" character varying NOT NULL,
        CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY ("id")
      );
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "UQ_migrations_name" ON "migrations" ("name");
    `);

    const migrations = [
      new CreateEnums(),
      new CreateUserTable(),
      new CreateBiodataTable(),
      new CreateFavoritesTable(),
      new CreateProfileViewsTable(),
    ];

    for (const migration of migrations) {
      console.log(`📋 Running migration: ${migration.name}`);
      await migration.up(queryRunner);

      const match = /^(.*?)(\d+)$/.exec(migration.name);
      const timestamp = match ? Number(match[2]) : Date.now();
      await queryRunner.query(
        `INSERT INTO "migrations" ("timestamp", "name") VALUES ($1, $2) ON CONFLICT (name) DO NOTHING`,
        [timestamp, migration.name]
      );

      console.log(`✅ Completed migration: ${migration.name}`);
    }

    console.log('🎉 All migrations completed successfully!');
  }
}

// Import seed function from database-seed.ts
import { seedDatabase } from './database-seed';

// Main database migration function
async function runDatabaseMigration() {
  try {
    console.log('🚀 Starting database migration...');
    
    // Initialize connection
    console.log('🔄 Initializing database connection...');
    try {
      await AppDataSource.initialize();
      console.log('✅ Database connection established');
    } catch (initError: any) {
      // If database does not exist, create it by connecting to the default 'postgres' DB
      const code = initError?.code;
      const msg = String(initError?.message || '');
      const dbMissing = code === '3D000' || /database .* does not exist/i.test(msg);
      if (!dbMissing) throw initError;

      console.log(`📋 Target database "${dbName}" not found. Attempting to create it...`);
      const adminDataSource = new DataSource({
        type: 'postgres',
        host: dbHost,
        port: dbPort,
        username: dbUser,
        password: dbPass,
        database: 'postgres',
        synchronize: false,
        logging: true,
      });

      try {
        await adminDataSource.initialize();
        // Sanitize DB name to avoid injection and ensure valid identifier
  const safeDbName = (dbName || 'finder').replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase() || 'finder';
        // Check existence then create
        const exists = await adminDataSource.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [safeDbName]);
        if (exists.length === 0) {
          await adminDataSource.query(`CREATE DATABASE ${safeDbName}`);
          console.log(`✅ Database created: ${safeDbName}`);
        } else {
          console.log('ℹ️ Database already exists, continuing...');
        }
  } finally {
        if (adminDataSource.isInitialized) {
          await adminDataSource.destroy();
        }
      }

      // Retry main connection
      await AppDataSource.initialize();
      console.log('✅ Database connection established (after create)');
    }

    // Ensure migrations table exists before querying it
    await AppDataSource.query(`
      CREATE TABLE IF NOT EXISTS "migrations" (
        "id" SERIAL NOT NULL,
        "timestamp" bigint NOT NULL,
        "name" character varying NOT NULL,
        CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY ("id")
      );
    `);
    await AppDataSource.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "UQ_migrations_name" ON "migrations" ("name");
    `);

    // Check if main orchestrator has been run
    const executedMigrations = await AppDataSource.query(`
      SELECT * FROM migrations WHERE name = 'MainOrchestrator'
    `);
    
    if (executedMigrations.length === 0) {
      console.log('📋 Main orchestrator not found, running all migrations...');
      
      // Run the main orchestrator
      const orchestrator = new MainOrchestrator();
      await orchestrator.up(AppDataSource.createQueryRunner());
      
      console.log('✅ Main orchestrator completed successfully');
    } else {
      console.log('✅ Main orchestrator already executed. Database is up to date.');
    }

    // Show migration status
    console.log('🔄 Checking migration status...');
    const allMigrations = await AppDataSource.query(`
      SELECT * FROM migrations ORDER BY timestamp DESC;
    `);
    
    console.log(`📊 Total executed migrations: ${allMigrations.length}`);
    if (allMigrations.length > 0) {
      console.log('📋 Executed migrations:');
      allMigrations.forEach(migration => {
        console.log(`  - ${migration.name}`);
      });
    }

    // Run seed data
    console.log('🔄 Running seed data...');
    await seedDatabase(AppDataSource);
    
    console.log('🎉 Database migration completed successfully!');
    
  } catch (error: any) {
    console.error('❌ Database migration failed:', error);
    
    // If database doesn't exist, provide helpful error message
    if (error?.code === '3D000') { // PostgreSQL error code for database does not exist
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
export { AppDataSource, runDatabaseMigration };

// Run if this file is executed directly
if (require.main === module) {
  void runDatabaseMigration();
}
