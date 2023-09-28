import { GetUserInput } from '../inputs/user-inputs';
import { Injectable } from '@nestjs/common';
import { UserModel } from '../models/user-model';
import { UserRepository } from '../repositories/user-repository';

@Injectable()
export class GetUserUsecase {
  constructor(private readonly userRepository: UserRepository) {}

  async call(body: GetUserInput): Promise<UserModel | undefined> {
    if (body.id || body.phoneNumber) {
      return await this.userRepository.get(body);
    }
  }
}
