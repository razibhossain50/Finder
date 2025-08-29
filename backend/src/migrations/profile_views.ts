export class CreateProfileViewsTable {
  name = 'CreateProfileViewsTable';

  async up(queryRunner: any): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "profile_views" (
        "id" SERIAL NOT NULL,
        "biodataId" integer NOT NULL,
        "viewerId" integer,
        "ipAddress" character varying,
        "userAgent" character varying,
        "viewedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_profile_views_id" PRIMARY KEY ("id")
      );
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.table_constraints 
          WHERE constraint_name = 'FK_profile_views_viewer' AND table_name = 'profile_views'
        ) THEN
          ALTER TABLE "profile_views" ADD CONSTRAINT "FK_profile_views_viewer" 
          FOREIGN KEY ("viewerId") REFERENCES "user"("id") ON DELETE SET NULL;
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.table_constraints 
          WHERE constraint_name = 'FK_profile_views_biodata' AND table_name = 'profile_views'
        ) THEN
          ALTER TABLE "profile_views" ADD CONSTRAINT "FK_profile_views_biodata" 
          FOREIGN KEY ("biodataId") REFERENCES "biodata"("id") ON DELETE CASCADE;
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_profile_views_viewer_id" ON "profile_views" ("viewerId");
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_profile_views_biodata_id" ON "profile_views" ("biodataId");
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_profile_views_viewed_at" ON "profile_views" ("viewedAt");
    `);
  }
}


