import { DataSource } from 'typeorm';
import { UserOrmEntity } from '../user/infrastructure/user.orm-entity';
import { BookOrmEntity } from '../books/infrastructure/book.orm-entity';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { Role } from '../auth/domain/enums/role.enum';
dotenv.config();

async function seed() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: +(process.env.DB_PORT || 5432),
    username: process.env.DB_USER || 'admin',
    password: process.env.DB_PASSWORD || '123456',
    database: process.env.DB_NAME || 'bookdb',
    entities: [ UserOrmEntity, BookOrmEntity ],
  });

  await dataSource.initialize();
  console.log('Connected to DB ✓');

  // ─── Seed Admin ──────────────────────────────────────
  const userRepo = dataSource.getRepository(UserOrmEntity );
  const adminExists = await userRepo.findOneBy({ email: 'admin@gmail.com' });

  if (!adminExists) {
    const admin = await userRepo.create({
      email: 'admin@gmail.com',
      password: await bcrypt.hash('Admin@123', 10),
      role: Role.ADMIN,
      isVerified: true,
    });
    await userRepo.save(admin);
    console.log('✓ Admin created');
  } else {
    console.log('Admin already exists, skipping...');
  }

  // ─── Seed Books ──────────────────────────────────────
  const bookRepo = dataSource.getRepository(BookOrmEntity);
  const bookCount = await bookRepo.count();

  if (bookCount === 0) {
    await bookRepo.save([
      { title: 'Clean Code', author: 'Robert Martin', price: 45, year: 2008 },
      { title: 'The Pragmatic Programmer', author: 'David Thomas', price: 50, year: 1999 },
      { title: 'Design Patterns', author: 'Gang of Four', price: 55, year: 1994 },
    ]);
    console.log('✓ Books seeded');
  } else {
    console.log('Books already exist, skipping...');
  }

  await dataSource.destroy();
  console.log('Seed done! ✓');
}

seed().catch(console.error);