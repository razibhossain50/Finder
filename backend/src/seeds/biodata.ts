export async function seedBiodata(dataSource: any): Promise<void> {
  const userRow = await dataSource.query(`SELECT id, "fullName", email FROM "user" WHERE email = $1 LIMIT 1`, ['user@finder.com']);
  if (!userRow.length) {
    console.log('⚠️ user@finder.com not found; skipping demo biodata creation.');
    return;
  }

  const userId = userRow[0].id;
  const existingBiodata = await dataSource.query(`SELECT id FROM biodata WHERE "userId" = $1 LIMIT 1`, [userId]);
  if (existingBiodata.length > 0) {
    console.log('ℹ️ Demo biodata already exists for user@finder.com. Skipping.');
    return;
  }

  console.log('🌱 Creating demo biodata for user@finder.com...');
  await dataSource.query(`
    INSERT INTO "biodata" (
      "userId",
      "step",
      "completedSteps",
      "fullName",
      "email",
      "biodataType",
      "maritalStatus",
      "dateOfBirth",
      "age",
      "height",
      "weight",
      "complexion",
      "profession",
      "bloodGroup",
      "educationMedium",
      "highestEducation",
      "instituteName",
      "subject",
      "passingYear",
      "result",
      "permanentCountry",
      "permanentDivision",
      "permanentZilla",
      "permanentUpazilla",
      "permanentArea",
      "presentCountry",
      "presentDivision",
      "presentZilla",
      "presentUpazilla",
      "presentArea",
      "healthIssues",
      "partnerAgeMin",
      "partnerAgeMax",
      "partnerComplexion",
      "partnerHeight",
      "partnerEducation",
      "partnerProfession",
      "partnerLocation",
      "partnerDetails",
      "guardianMobile",
      "ownMobile",
      "biodataApprovalStatus",
      "biodataVisibilityStatus"
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19,
      $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36,
      $37, $38, $39, $40, $41, $42, $43
    )
  `, [
    userId,
    3,
    '1,2,3',
    userRow[0].fullName || 'Test User',
    'user@finder.com',
    'general',
    'single',
    '1997-01-15',
    28,
    '5ft 7in',
    70,
    'Fair',
    'Software Engineer',
    'O+',
    'Bangla',
    'B.Sc. in CSE',
    'BUET',
    'Computer Science and Engineering',
    2019,
    'CGPA 3.75/4.00',
    'Bangladesh',
    'Dhaka',
    'Dhaka',
    'Tejgaon',
    'Road 12, House 34',
    'Bangladesh',
    'Dhaka',
    'Dhaka',
    'Tejgaon',
    'Road 12, House 34',
    'None',
    24,
    32,
    'Any',
    '5ft 2in +',
    'Bachelor or above',
    'Any respectable job',
    'Dhaka preferred',
    'Looking for a kind and supportive partner',
    '01700000000',
    '01800000000',
    'pending',
    'active'
  ]);
}


