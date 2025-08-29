export class CreateUserTable {
  name = 'CreateUserTable';

  async up(queryRunner: any): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "user" (
        "id" SERIAL NOT NULL,
        "fullName" character varying,
        "email" character varying NOT NULL,
        "password" character varying,
        "googleId" character varying,
        "profilePicture" character varying,
        "role" user_role_enum NOT NULL DEFAULT 'user',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_user_id" PRIMARY KEY ("id")
      );
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "UQ_user_email" ON "user" ("email");
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_user_email" ON "user" ("email");
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_user_google_id" ON "user" ("googleId") WHERE "googleId" IS NOT NULL;
    `);
  }
}


