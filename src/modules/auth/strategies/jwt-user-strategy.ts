import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthPayloadModel } from '../domain/models/auth-payload-model';
import { AuthProvider } from '../domain/providers/auth-provider';
import { LogicalException } from '../../../exceptions/logical-exception';
import { ErrorCode } from '../../../exceptions/error-code';
import { GetUserUsecase } from 'src/modules/user/domain/usecases/get-user-usecase';
import { AuthException } from 'src/exceptions/auth-exception';

@Injectable()
export class JwtUserStrategy extends PassportStrategy(Strategy, 'jwt_user') {
  constructor(configService: ConfigService, private readonly getUserUsecase: GetUserUsecase) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([ExtractJwt.fromAuthHeaderAsBearerToken()]),
      ignoreExpiration: false,
      algorithms: [configService.get<string>('auth.jwt.signOptions.algorithm')],
      secretOrKey: configService.get<string>('auth.jwt.publicKey'),
    });
  }

  async validate(payload: any): Promise<AuthPayloadModel> {
    const authPayload: AuthPayloadModel = payload.auth_payload;
    if (authPayload.provider !== AuthProvider.User) {
      throw new LogicalException(
        ErrorCode.AUTH_USER_NEED_USER_PERMISSION,
        'Auth user need user permission.',
        undefined,
      );
    }

    if (!(await this.getUserUsecase.call({ id: authPayload.authenticatableId }))) {
      throw new AuthException(ErrorCode.AUTH_USER_NOT_FOUND, 'Auth user not found.', undefined, undefined);
    }

    return authPayload;
  }
}
