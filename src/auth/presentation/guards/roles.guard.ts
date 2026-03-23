import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../../domain/enums/role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Đọc nhãn @Roles() trên route
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Không có @Roles() → cho qua
    if (!requiredRoles) return true;

    // 2. Lấy user từ request (do JwtAuthGuard gắn vào)
    const { user } = context.switchToHttp().getRequest();

    // 3. Kiểm tra role có khớp không
    return requiredRoles.includes(user.role);
  }
}