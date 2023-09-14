import { GetUserBody } from '../interfaces/user-interface';
import { Injectable } from '@nestjs/common';
import { UserModel } from '../models/user-model';
import { UserRepository } from '../repositories/user-repository';

@Injectable()
export class GetUserUsecase {
  constructor(private readonly userRepository: UserRepository) {}

  async call(body: GetUserBody): Promise<UserModel | undefined> {
    return await this.userRepository.get(body);
  }
}
