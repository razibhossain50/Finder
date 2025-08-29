import * as bcrypt from 'bcryptjs';

export async function seedUser(dataSource: any): Promise<void> {
  const existingUsers = await dataSource.query('SELECT COUNT(*) as count FROM "user"');
  if (parseInt(existingUsers[0].count) > 0) {
    console.log('📊 Users already exist in database. Skipping seed.');
    return;
  }
  console.log('🌱 Seeding initial users...');
  const adminPassword = await bcrypt.hash('Testpass@50', 10);
  const userPassword = await bcrypt.hash('Testpass@50', 10);

  await dataSource.query(`
    INSERT INTO "user" ("fullName", "email", "password", "role", "createdAt", "updatedAt")
    VALUES ($1, $2, $3, $4, NOW(), NOW())
  `, ['Admin User', 'admin@finder.com', adminPassword, 'admin']);

  await dataSource.query(`
    INSERT INTO "user" ("fullName", "email", "password", "role", "createdAt", "updatedAt")
    VALUES ($1, $2, $3, $4, NOW(), NOW())
  `, ['Test User', 'user@finder.com', userPassword, 'user']);

  console.log('✅ Successfully seeded initial users');
}


