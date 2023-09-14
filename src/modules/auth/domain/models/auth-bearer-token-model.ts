import { DomainModel } from '../../../../core/models/domain-model';
import { ApiProperty } from '@nestjs/swagger';

export class AuthBearerTokenModel extends DomainModel {
  @ApiProperty({ name: 'access_token' })
  public readonly accessToken: string;

  @ApiProperty({ name: 'token_type' })
  public readonly tokenType: string;

  @ApiProperty({ name: 'expires_in' })
  public readonly expiresIn: number;

  constructor(accessToken: string, tokenType: string, expiresIn: number) {
    super();
    this.accessToken = accessToken;
    this.tokenType = tokenType;
    this.expiresIn = expiresIn;
  }

  toJson(showHidden = false): Record<string, any> {
    return this.filterHiddenIfNeed(
      {
        access_token: this.accessToken,
        token_type: this.tokenType,
        expires_in: this.expiresIn,
      },
      showHidden,
    );
  }
}
