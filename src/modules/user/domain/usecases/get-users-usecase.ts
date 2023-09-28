import { Injectable } from '@nestjs/common';
import { PageList } from '../../../../core/models/page-list';
import { PaginationParams } from '../../../../core/models/pagination-params';
import { SortParams } from '../../../../core/models/sort-params';
import { UserModel } from '../models/user-model';
import { UserRepository } from '../repositories/user-repository';

@Injectable()
export class GetUsersUsecase {
  constructor(private readonly userRepository: UserRepository) {}

  async call(
    paginationParams: PaginationParams,
    sortParams: SortParams,
    ignoreUsers: UserModel[] | undefined,
    relations: string[] | undefined,
  ): Promise<PageList<UserModel>> {
    return await this.userRepository.list(paginationParams, sortParams, ignoreUsers, relations);
  }
}
