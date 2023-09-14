import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { AuthProvider } from '../../domain/providers/auth-provider';
import { IsPhoneNumberWithCountryCode } from 'src/core/rules/is-phone-number-with-country-code';
import { PhoneNumberModel } from 'src/modules/phone-number/domain/models/phone-number-model';
import { Transform } from 'class-transformer';

export class AuthDto {
  @ApiProperty()
  @IsString()
  client_id!: string;

  @ApiProperty()
  @IsString()
  client_secret!: string;

  @ApiProperty({ type: 'string' })
  @IsPhoneNumberWithCountryCode()
  @Transform((value: any) => {
    return value.obj?.phone_number ? PhoneNumberModel.parsedPhoneNumber(value.obj.phone_number) : undefined;
  })
  @IsNotEmpty()
  phone_number!: PhoneNumberModel;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password!: string;
}

export class LoginAuthDto extends PickType(AuthDto, ['client_id', 'client_secret', 'phone_number', 'password']) {}

export class CreateAuthClientCommandParamsDto {
  @ApiProperty()
  @IsEnum(AuthProvider)
  provider!: AuthProvider;
}
