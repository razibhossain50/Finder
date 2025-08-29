export class CreateFavoritesTable {
  name = 'CreateFavoritesTable';

  async up(queryRunner: any): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "favorites" (
        "id" SERIAL NOT NULL,
        "userId" integer NOT NULL,
        "biodataId" integer NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_favorites_id" PRIMARY KEY ("id")
      );
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.table_constraints 
          WHERE constraint_name = 'FK_favorites_user' AND table_name = 'favorites'
        ) THEN
          ALTER TABLE "favorites" ADD CONSTRAINT "FK_favorites_user" 
          FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE;
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.table_constraints 
          WHERE constraint_name = 'FK_favorites_biodata' AND table_name = 'favorites'
        ) THEN
          ALTER TABLE "favorites" ADD CONSTRAINT "FK_favorites_biodata" 
          FOREIGN KEY ("biodataId") REFERENCES "biodata"("id") ON DELETE CASCADE;
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "UQ_favorites_user_biodata" 
      ON "favorites" ("userId", "biodataId");
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_favorites_user_id" ON "favorites" ("userId");
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_favorites_biodata_id" ON "favorites" ("biodataId");
    `);
  }
}


