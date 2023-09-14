import { v4 as uuidV4 } from 'uuid';
import * as cryptoJs from 'crypto-js';
import { throwError } from '../../../../../core/helpers/utils';
import { ConfigService } from '@nestjs/config';
import { Command, CommandRunner } from 'nest-commander';
import { AuthProvider } from 'src/modules/auth/domain/providers/auth-provider';
import { LogicalException } from 'src/exceptions/logical-exception';
import { ErrorCode } from 'src/exceptions/error-code';

@Command({
  name: 'auth:client:create',
  arguments: '<provider>',
})
export class CreateAuthClientCommand extends CommandRunner {
  constructor(private readonly configService: ConfigService) {
    super();
  }

  public async run(inputs: string[]): Promise<void> {
    const provider = inputs[0];

    if (!Object.values(AuthProvider).includes(<any>provider)) {
      throw new LogicalException(ErrorCode.AUTH_PROVIDER_INVALID, 'Auth provider invalid', undefined);
    }

    const clientId = provider + '_' + uuidV4();
    const clientSecret = cryptoJs
      .HmacSHA512(clientId, this.configService.get<string>('auth.hashKey') ?? throwError())
      .toString();

    console.log('=============================');
    console.log('provider: ' + provider);
    console.log('client_id: ' + clientId);
    console.log('client_secret: ' + clientSecret);
  }
}
