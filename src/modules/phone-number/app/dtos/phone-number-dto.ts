import { IsPhoneNumberWithCountryCode } from '../../../../core/rules/is-phone-number-with-country-code';
import { Transform } from 'class-transformer';
import { PhoneNumberModel } from '../../domain/models/phone-number-model';
import { ApiProperty } from '@nestjs/swagger';

export class PhoneNumberDto {
  @ApiProperty({ type: 'string' })
  @IsPhoneNumberWithCountryCode()
  @Transform((value: any): PhoneNumberModel => {
    return PhoneNumberModel.parsedPhoneNumber(value.obj?.phone_number);
  })
  phone_number!: PhoneNumberModel;
}
