import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user-repository';
import { UserModel } from '../models/user-model';
import { throwError } from '../../../../core/helpers/utils';
import { UpdateUserInput } from '../inputs/user-inputs';

@Injectable()
export class UpdateUserUsecase {
  constructor(private readonly userRepository: UserRepository) {}

  async call(user: UserModel, body: UpdateUserInput): Promise<UserModel> {
    if (body.avatarPath || body.name) {
      await this.userRepository.update(user, body);
    }

    return (await this.userRepository.get({ id: user.id })) ?? throwError();
  }
}
