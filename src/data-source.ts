import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: +(process.env.DB_PORT || 5432),
  username: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || '123456',
  database: process.env.DB_NAME || 'bookdb',
  // QUAN TRỌNG: Trỏ đúng vào các file ORM Entity trong cấu trúc DDD mới
  entities: [
  'src/user/infrastructure/user.orm-entity.ts',
  'src/books/infrastructure/book.orm-entity.ts',
  ],
  migrations: ['src/migrations/*.ts'],
});