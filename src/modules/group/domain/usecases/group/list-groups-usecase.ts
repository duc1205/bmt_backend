import { Injectable } from '@nestjs/common';
import { GroupRepository } from '../../repositories/group-repository';
import { UserModel } from 'src/modules/user/domain/models/user-model';
import { GroupModel } from '../../models/group-model';
import { PaginationParams } from 'src/core/models/pagination-params';
import { SortParams } from 'src/core/models/sort-params';
import { PageList } from 'src/core/models/page-list';

@Injectable()
export class ListGroupsUsecase {
  constructor(private readonly groupRepository: GroupRepository) {}

  async call(
    paginationParams: PaginationParams,
    sortParams: SortParams,
    user: UserModel | undefined,
    relations: string[] | undefined,
  ): Promise<PageList<GroupModel>> {
    return await this.groupRepository.list(paginationParams, sortParams, user, relations);
  }
}
