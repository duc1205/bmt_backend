import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthException } from 'src/exceptions/auth-exception';
import { ErrorCode } from 'src/exceptions/error-code';
import { ErrorException } from '../../../exceptions/error-exception';

@Injectable()
export class UserAuthGuard extends AuthGuard('jwt_user') {
  handleRequest(err: any, user: any) {
    if (err || !user) {
      if (err instanceof ErrorException) {
        throw err;
      }
      throw new AuthException(ErrorCode.AUTH_USER_NOT_FOUND, 'Auth user not found.', 'User not found.', undefined);
    }

    return user;
  }
}
