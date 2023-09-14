import * as cryptoJs from 'crypto-js';
import ms, { StringValue } from 'ms';
import { AuthBearerTokenModel } from '../models/auth-bearer-token-model';
import { AuthException } from '../../../../exceptions/auth-exception';
import { AuthProvider } from '../providers/auth-provider';
import { ConfigService } from '@nestjs/config';
import { CreateAuthPayloadUsecase } from './auth-payload/create-auth-payload-usecase';
import { ErrorCode } from '../../../../exceptions/error-code';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { throwError } from '../../../../core/helpers/utils';
import { GetUserUsecase } from 'src/modules/user/domain/usecases/get-user-usecase';
import { CheckUserPasswordUsecase } from 'src/modules/user/domain/usecases/check-user-password-usecase';
import { PhoneNumberModel } from 'src/modules/phone-number/domain/models/phone-number-model';
import { LogicalException } from 'src/exceptions/logical-exception';

@Injectable()
export class LoginUsecase {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly createAuthPayloadUsecase: CreateAuthPayloadUsecase,
    private readonly getUserUsecase: GetUserUsecase,
    private readonly checkUserPasswordUsecase: CheckUserPasswordUsecase,
  ) {}

  async call(
    clientId: string,
    clientSecret: string,
    phoneNumber: PhoneNumberModel,
    password: string,
  ): Promise<AuthBearerTokenModel> {
    if (!this.checkAuthClient(clientId, clientSecret)) {
      throw new AuthException(
        ErrorCode.AUTH_CLIENT_NOT_FOUND,
        'Client id and client secret are incorrect.',
        undefined,
        undefined,
      );
    }

    const provider = this.getProvider(clientId);
    if (!provider) {
      throw new AuthException(ErrorCode.AUTH_CLIENT_NOT_FOUND, 'Client not found.', undefined, undefined);
    }

    const user = await this.getUserUsecase.call({ phoneNumber: phoneNumber });
    if (!user) {
      throw new LogicalException(ErrorCode.AUTH_USER_NOT_FOUND, 'User not found.', undefined);
    }
    if (!(await this.checkUserPasswordUsecase.call(user, password))) {
      throw new LogicalException(ErrorCode.AUTH_USER_PASSWORD_INCORRECT, 'Password is incorrect.', undefined);
    }

    const authPayload = await this.createAuthPayloadUsecase.call(user.id, provider);

    const jwt = await this.jwtService.signAsync({ auth_payload: authPayload });

    const authBearerTokenModel = new AuthBearerTokenModel(
      jwt,
      'Bearer',
      Math.floor(ms(this.configService.get<StringValue>('auth.jwt.signOptions.expiresIn') ?? throwError()) / 1000),
    );

    return authBearerTokenModel;
  }

  private getProvider(clientId: string): AuthProvider | null {
    const provider = clientId.slice(0, clientId.lastIndexOf('_'));
    if (!provider || !Object.values(AuthProvider).includes(provider as AuthProvider)) {
      return null;
    }

    return provider as AuthProvider;
  }

  private checkAuthClient(clientId: string, clientSecret: string): boolean {
    const clientIdHashed = cryptoJs
      .HmacSHA512(clientId, this.configService.get<string>('auth.hashKey') ?? throwError())
      .toString();

    return clientIdHashed == clientSecret;
  }
}
