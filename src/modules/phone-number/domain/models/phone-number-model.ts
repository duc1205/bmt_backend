import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import parsePhoneNumberFromString, { CountryCode, PhoneNumber as PhoneNumberLib } from 'libphonenumber-js';
import { DomainModel } from '../../../../core/models/domain-model';
import { LogicalException } from '../../../../exceptions/logical-exception';
import { ErrorCode } from '../../../../exceptions/error-code';

export class PhoneNumberModel extends DomainModel {
  @ApiProperty({ name: 'country_calling_code' })
  public readonly countryCallingCode: string;

  @ApiProperty({ name: 'national_number' })
  public readonly nationalNumber: string;

  @ApiProperty()
  public readonly number: string;

  @ApiPropertyOptional()
  public readonly country: CountryCode | undefined;

  constructor(countryCallingCode: string, nationalNumber: string, number: string, country: CountryCode | undefined) {
    super();
    this.countryCallingCode = countryCallingCode;
    this.nationalNumber = nationalNumber;
    this.number = number;
    this.country = country;
  }

  toJson(showHidden = false): Record<string, any> {
    return this.filterHiddenIfNeed(
      {
        country_calling_code: this.countryCallingCode,
        national_number: this.nationalNumber,
        number: this.number,
        country: this.country,
      },
      showHidden,
    );
  }

  static fromPhoneNumberLib(phoneNumber: PhoneNumberLib): PhoneNumberModel {
    return new PhoneNumberModel(
      `+${phoneNumber.countryCallingCode}`,
      phoneNumber.nationalNumber,
      phoneNumber.number,
      phoneNumber.country,
    );
  }

  static parsedPhoneNumber(value: any): PhoneNumberModel {
    const parsedPhoneNumber = parsePhoneNumberFromString(value);

    if (!parsedPhoneNumber) {
      throw new LogicalException(ErrorCode.PHONE_NUMBER_INVALID, 'Phone number is invalid.', undefined);
    }

    return this.fromPhoneNumberLib(parsedPhoneNumber);
  }
}
