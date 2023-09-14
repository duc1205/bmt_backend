import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user-repository';
import { UserModel } from '../models/user-model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ResetUserPasswordUsecase {
  constructor(private readonly userRepository: UserRepository) {}

  async call(user: UserModel, password: string): Promise<void> {
    const hashPassword = await bcrypt.hash(password, 10);
    await this.userRepository.changePassword(user, hashPassword);
  }
}
