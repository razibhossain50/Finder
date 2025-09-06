export class CreateEnums {
  name = 'CreateEnums';

  async up(queryRunner: any): Promise<void> {
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role_enum') THEN
          CREATE TYPE user_role_enum AS ENUM ('user', 'admin', 'superadmin');
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        -- Drop existing enum types if they exist to ensure clean creation with correct values
        DROP TYPE IF EXISTS biodata_approval_status_enum CASCADE;
        DROP TYPE IF EXISTS biodata_visibility_status_enum CASCADE;
        
        -- Create enum types with correct values
        CREATE TYPE biodata_approval_status_enum AS ENUM ('in_progress', 'pending', 'approved', 'rejected', 'inactive');
        CREATE TYPE biodata_visibility_status_enum AS ENUM ('active', 'inactive');
      END
      $$;
    `);
  }
}


