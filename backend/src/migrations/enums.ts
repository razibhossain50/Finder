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
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'biodata_approval_status_enum') THEN
          CREATE TYPE biodata_approval_status_enum AS ENUM ('pending', 'approved', 'rejected', 'inactive');
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'biodata_visibility_status_enum') THEN
          CREATE TYPE biodata_visibility_status_enum AS ENUM ('active', 'inactive');
        END IF;
      END
      $$;
    `);
  }
}


