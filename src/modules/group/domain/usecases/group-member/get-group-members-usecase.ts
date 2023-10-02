import { GroupMemberModel } from '../../models/group-member-model';
import { GroupMemberRepository } from '../../repositories/group-member-repository';
import { GroupModel } from '../../models/group-model';
import { Injectable } from '@nestjs/common';
import { PageList } from 'src/core/models/page-list';
import { PaginationParams } from 'src/core/models/pagination-params';
import { SortParams } from 'src/core/models/sort-params';

@Injectable()
export class GetGroupMembersUsecase {
  constructor(private readonly groupMemberRepository: GroupMemberRepository) {}

  async call(
    paginationParams: PaginationParams,
    sortParams: SortParams,
    group: GroupModel,
    relations: string[] | undefined,
  ): Promise<PageList<GroupMemberModel>> {
    return await this.groupMemberRepository.list(paginationParams, sortParams, group, relations);
  }
}
