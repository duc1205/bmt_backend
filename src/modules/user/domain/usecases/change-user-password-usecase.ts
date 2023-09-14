import * as bcrypt from 'bcrypt';
import { ChangePasswordUserInterface } from '../interfaces/user-interface';
import { CheckUserPasswordUsecase } from './check-user-password-usecase';
import { ErrorCode } from '../../../../exceptions/error-code';
import { Injectable } from '@nestjs/common';
import { LogicalException } from '../../../../exceptions/logical-exception';
import { UserModel } from '../models/user-model';
import { UserRepository } from '../repositories/user-repository';

@Injectable()
export class ChangeUserPasswordUsecase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly checkUserPasswordUsecase: CheckUserPasswordUsecase,
  ) {}

  async call(user: UserModel, body: ChangePasswordUserInterface): Promise<void> {
    if (!(await this.checkUserPasswordUsecase.call(user, body.oldPassword))) {
      throw new LogicalException(ErrorCode.USER_OLD_PASSWORD_NOT_CORRECT, 'Your password is not correct.', undefined);
    }

    const hashPassword = await bcrypt.hash(body.password, 10);
    await this.userRepository.changePassword(user, hashPassword);
  }
}
