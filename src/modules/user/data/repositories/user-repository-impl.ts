import { Injectable } from '@nestjs/common';
import { UserModel } from '../../domain/models/user-model';
import { UserRepository } from '../../domain/repositories/user-repository';
import { UserDatasource } from '../datasources/user-datasource';
import { PaginationParams } from 'src/core/models/pagination-params';
import { SortParams } from 'src/core/models/sort-params';
import { PageList } from 'src/core/models/page-list';
import { GetUserBody, UpdateUserInterface } from '../../domain/interfaces/user-interface';
import { PhoneNumberModel } from 'src/modules/phone-number/domain/models/phone-number-model';

@Injectable()
export class UserRepositoryImpl extends UserRepository {
  constructor(private readonly userDatasource: UserDatasource) {
    super();
  }

  async list(
    paginationParams: PaginationParams,
    sortParams: SortParams,
    relations: string[] | undefined,
  ): Promise<PageList<UserModel>> {
    return await this.userDatasource.list(paginationParams, sortParams, relations);
  }

  async get(body: GetUserBody): Promise<UserModel | undefined> {
    return await this.userDatasource.get(body);
  }

  async create(user: UserModel): Promise<void> {
    await this.userDatasource.create(user);
  }

  async update(user: UserModel, body: UpdateUserInterface): Promise<void> {
    await this.userDatasource.update(user, body);
  }

  async changePassword(user: UserModel, password: string): Promise<void> {
    await this.userDatasource.changePassword(user, password);
  }

  async checkUserPhoneNumberExists(phoneNumber: PhoneNumberModel): Promise<boolean> {
    return await this.userDatasource.checkUserPhoneNumberExists(phoneNumber);
  }

  async delete(user: UserModel): Promise<void> {
    return await this.userDatasource.delete(user);
  }
}
