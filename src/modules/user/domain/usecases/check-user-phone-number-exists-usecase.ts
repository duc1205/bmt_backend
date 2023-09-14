import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user-repository';
import { PhoneNumberModel } from 'src/modules/phone-number/domain/models/phone-number-model';

@Injectable()
export class CheckUserPhoneNumberExistsUsecase {
  constructor(private readonly userRepository: UserRepository) {}

  async call(phoneNumber: PhoneNumberModel): Promise<boolean> {
    return await this.userRepository.checkUserPhoneNumberExists(phoneNumber);
  }
}
