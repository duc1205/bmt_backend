import { PhoneNumberModel } from 'src/modules/phone-number/domain/models/phone-number-model';

export type UserInput = {
  id: string;
  name: string;
  phoneNumber: PhoneNumberModel;
  password: string;
  avatarPath?: string | undefined | null;
};

export type CreateUserInput = Pick<UserInput, 'name' | 'password' | 'phoneNumber' | 'avatarPath'>;

export type UpdateUserInput = Partial<Pick<UserInput, 'name' | 'avatarPath'>>;

export type GetUserInput = Partial<Pick<UserInput, 'id' | 'phoneNumber'>>;

export type ChangePasswordUserInput = Pick<UserInput, 'password'> & { oldPassword: string };
