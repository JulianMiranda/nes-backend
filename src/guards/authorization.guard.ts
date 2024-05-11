import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private allowedRoles: string[]) {}

  canActivate(context: ExecutionContext): boolean {
    const host = context.switchToHttp();
    const req = host.getRequest();
    const user = req['user'];
    const allowed = this.isAllowed(user.permissions);
    if (!allowed) {
      console.log('User is authenticated but not authorized, denying access');
      throw new ForbiddenException();
    }
    return true;
  }

  isAllowed(userRoles: string[]) {
    let allowed = false;
    userRoles.map((role) => {
      if (!allowed && this.allowedRoles.includes(role)) {
        allowed = true;
      }
    });
    return allowed;
  }
}
