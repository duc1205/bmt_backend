import * as bcrypt from 'bcrypt';
import { CheckUserPhoneNumberExistsUsecase } from './check-user-phone-number-exists-usecase';
import { CreateUserInput } from '../inputs/user-inputs';
import { ErrorCode } from 'src/exceptions/error-code';
import { Injectable } from '@nestjs/common';
import { LogicalException } from 'src/exceptions/logical-exception';
import { UserModel } from '../models/user-model';
import { UserRepository } from '../repositories/user-repository';
import { v4 as uuidV4 } from 'uuid';

@Injectable()
export class CreateUserUsecase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly checkUserPhoneNumberExistsUsecase: CheckUserPhoneNumberExistsUsecase,
  ) {}

  async call(body: CreateUserInput): Promise<UserModel> {
    if (await this.checkUserPhoneNumberExistsUsecase.call(body.phoneNumber)) {
      throw new LogicalException(ErrorCode.USER_PHONE_NUMBER_EXIST, 'Phone number already exists.', undefined);
    }

    const hashPassword = await bcrypt.hash(body.password, 10);

    const user = new UserModel(
      uuidV4(),
      hashPassword,
      body.name,
      body.phoneNumber.number,
      body.avatarPath,
      new Date(),
      new Date(),
    );

    await this.userRepository.create(user);

    return user;
  }
}
