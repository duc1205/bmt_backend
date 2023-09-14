import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { PhoneNumberModel } from '../../modules/phone-number/domain/models/phone-number-model';
import { isValidNumberForRegion } from 'libphonenumber-js';

@ValidatorConstraint({ name: 'phoneNumberConstraint', async: true })
@Injectable()
export class PhoneNumberConstraint implements ValidatorConstraintInterface {
  async validate(value: PhoneNumberModel) {
    if (value && value.country) {
      return isValidNumberForRegion(value.nationalNumber, value.country);
    }
    return false;
  }

  defaultMessage(): string {
    return 'Phone number is invalid for region.';
  }
}

export const IsPhoneNumberWithCountryCode = () => {
  const validationOptions: ValidationOptions = {};
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: PhoneNumberConstraint,
    });
  };
};
