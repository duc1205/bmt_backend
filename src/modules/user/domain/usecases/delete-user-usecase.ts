import { Injectable } from '@nestjs/common';
import { UserModel } from '../models/user-model';
import { UserRepository } from '../repositories/user-repository';
import { ListGroupsUsecase } from 'src/modules/group/domain/usecases/group/list-groups-usecase';
import { PaginationParams } from 'src/core/models/pagination-params';
import { SortParams } from 'src/core/models/sort-params';
import { RemoveGroupMemberUsecase } from 'src/modules/group/domain/usecases/group-member/remove-group-member-usecase';
import { throwError } from 'src/core/helpers/utils';

@Injectable()
export class DeleteUserUsecase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly removeGroupMemberUsecase: RemoveGroupMemberUsecase,
    private readonly listGroupsUsecase: ListGroupsUsecase,
  ) {}
  async call(user: UserModel): Promise<void> {
    let groupList = undefined;
    let page = 1;
    do {
      groupList = (
        await this.listGroupsUsecase.call(
          new PaginationParams(page, 100, false, false),
          new SortParams(undefined, undefined),
          user,
          ['owner'],
        )
      ).data;

      for (const group of groupList) {
        await this.removeGroupMemberUsecase.call(group, group.owner ?? throwError(), user);
      }

      page++;
    } while (groupList.length > 0);

    return await this.userRepository.delete(user);
  }
}
