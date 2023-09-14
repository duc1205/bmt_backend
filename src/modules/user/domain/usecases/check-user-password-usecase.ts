import { Injectable } from '@nestjs/common';
import { UserModel } from '../models/user-model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CheckUserPasswordUsecase {
  async call(user: UserModel, password: string): Promise<boolean> {
    return await bcrypt.compare(password, user.password);
  }
}
