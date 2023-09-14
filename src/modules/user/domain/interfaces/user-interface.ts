import { PhoneNumberModel } from 'src/modules/phone-number/domain/models/phone-number-model';

export type UserInterface = {
  id: string;
  name: string;
  phoneNumber: PhoneNumberModel;
  password: string;
  avatarPath?: string | undefined | null;
};

export type CreateUserInterface = Pick<UserInterface, 'name' | 'password' | 'phoneNumber' | 'avatarPath'>;

export type UpdateUserInterface = Partial<Pick<UserInterface, 'name' | 'avatarPath'>>;

export type GetUserBody = Partial<Pick<UserInterface, 'id' | 'phoneNumber'>>;

export type ChangePasswordUserInterface = Pick<UserInterface, 'password'> & { oldPassword: string };
