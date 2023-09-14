import { AuthException } from '../../../exceptions/auth-exception';
import { AuthGuard } from '@nestjs/passport';
import { ErrorCode } from '../../../exceptions/error-code';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { IS_PUBLIC_KEY } from '../decorators/metadata';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard extends AuthGuard(['jwt_user']) {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw new AuthException(ErrorCode.AUTH_USER_NOT_FOUND, 'Auth user not found.', undefined, undefined);
    }
    return user;
  }
}
