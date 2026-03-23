import { User } from '../domain/user.entity';
import { UserOrmEntity } from './user.orm-entity';

export class UserMapper {
  static toDomain(orm: UserOrmEntity): User {
    return new User(orm);
  }
  static toOrm(domain: User): UserOrmEntity {
    const orm = new UserOrmEntity();
    if (domain.id) orm.id = domain.id;
    orm.email = domain.email;
    orm.password = domain.password;
    orm.isVerified = domain.isVerified;
    orm.role = domain.role;
    orm.refreshToken = domain.refreshToken;
    orm.refreshTokenExpiresAt = domain.refreshTokenExpiresAt;
    return orm;
  }
}