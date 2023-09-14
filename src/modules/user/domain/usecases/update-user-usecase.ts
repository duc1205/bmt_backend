import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user-repository';
import { UserModel } from '../models/user-model';
import { throwError } from '../../../../core/helpers/utils';
import { UpdateUserInterface } from '../interfaces/user-interface';

@Injectable()
export class UpdateUserUsecase {
  constructor(private readonly userRepository: UserRepository) {}

  async call(user: UserModel, body: UpdateUserInterface): Promise<UserModel> {
    /* if (avatarPath !== undefined && avatarPath != user.avatarPath && user.avatarPath) {
      await this.deleteFileUsecase.call(user.avatarPath);
    } */

    await this.userRepository.update(user, body);

    return (await this.userRepository.get({ id: user.id })) ?? throwError();
  }
}
