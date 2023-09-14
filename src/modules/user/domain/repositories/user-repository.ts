import { UserModel } from '../models/user-model';
import { PaginationParams } from 'src/core/models/pagination-params';
import { SortParams } from 'src/core/models/sort-params';
import { PageList } from 'src/core/models/page-list';
import { GetUserBody, UpdateUserInterface } from '../interfaces/user-interface';
import { PhoneNumberModel } from 'src/modules/phone-number/domain/models/phone-number-model';

export abstract class UserRepository {
  abstract list(
    paginationParams: PaginationParams,
    sortParams: SortParams,
    relations: string[] | undefined,
  ): Promise<PageList<UserModel>>;

  abstract get(body: GetUserBody): Promise<UserModel | undefined>;

  abstract create(user: UserModel): Promise<void>;

  abstract update(user: UserModel, body: UpdateUserInterface): Promise<void>;

  abstract changePassword(user: UserModel, password: string): Promise<void>;

  abstract checkUserPhoneNumberExists(phoneNumber: PhoneNumberModel): Promise<boolean>;

  abstract delete(user: UserModel): Promise<void>;
}
