export class CreateBiodataTable {
  name = 'CreateBiodataTable';

  async up(queryRunner: any): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "biodata" (
        "id" SERIAL NOT NULL,
        "step" integer NOT NULL DEFAULT 1,
        "userId" integer,
        "completedSteps" text,
        "partnerAgeMin" integer,
        "partnerAgeMax" integer,
        "sameAsPermanent" boolean DEFAULT false,
        "religion" character varying,
        "biodataType" character varying,
        "maritalStatus" character varying,
        "dateOfBirth" character varying,
        "age" integer,
        "height" character varying,
        "weight" integer,
        "complexion" character varying,
        "profession" character varying,
        "bloodGroup" character varying,
        "permanentCountry" character varying,
        "permanentDivision" character varying,
        "permanentZilla" character varying,
        "permanentUpazilla" character varying,
        "permanentArea" character varying,
        "presentCountry" character varying,
        "presentDivision" character varying,
        "presentZilla" character varying,
        "presentUpazilla" character varying,
        "presentArea" character varying,
        "healthIssues" character varying,
        "educationMedium" character varying,
        "highestEducation" character varying,
        "instituteName" character varying,
        "subject" character varying,
        "passingYear" integer,
        "result" character varying,
        "economicCondition" character varying,
        "fatherName" character varying,
        "fatherProfession" character varying,
        "fatherAlive" character varying,
        "motherName" character varying,
        "motherProfession" character varying,
        "motherAlive" character varying,
        "brothersCount" integer,
        "sistersCount" integer,
        "familyDetails" character varying,
        "partnerComplexion" character varying,
        "partnerHeight" character varying,
        "partnerEducation" character varying,
        "partnerProfession" character varying,
        "partnerLocation" character varying,
        "partnerDetails" character varying,
        "fullName" character varying,
        "profilePicture" character varying,
        "email" character varying,
        "guardianMobile" character varying,
        "ownMobile" character varying,
        "biodataApprovalStatus" biodata_approval_status_enum NOT NULL DEFAULT 'pending',
        "biodataVisibilityStatus" biodata_visibility_status_enum NOT NULL DEFAULT 'active',
        "viewCount" integer NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_biodata_id" PRIMARY KEY ("id")
      );
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.table_constraints 
          WHERE constraint_name = 'FK_biodata_user' AND table_name = 'biodata'
        ) THEN
          ALTER TABLE "biodata" ADD CONSTRAINT "FK_biodata_user" 
          FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE;
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_biodata_user_id" ON "biodata" ("userId");
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_biodata_approval_status" ON "biodata" ("biodataApprovalStatus");
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_biodata_visibility_status" ON "biodata" ("biodataVisibilityStatus");
    `);
  }
}


