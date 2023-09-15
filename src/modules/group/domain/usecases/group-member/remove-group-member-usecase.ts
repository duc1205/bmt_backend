import { Injectable } from '@nestjs/common';
import { GroupModel } from '../../models/group-model';
import { UserModel } from 'src/modules/user/domain/models/user-model';
import { GroupMemberRepository } from '../../repositories/group-member-repository';
import { PaginationParams } from 'src/core/models/pagination-params';
import { SortParams } from 'src/core/models/sort-params';
import { GroupRepository } from '../../repositories/group-repository';
import { GetUserUsecase } from 'src/modules/user/domain/usecases/get-user-usecase';
import { throwError } from 'src/core/helpers/utils';
import { Transactional } from 'typeorm-transactional';
import { LogicalException } from 'src/exceptions/logical-exception';
import { ErrorCode } from 'src/exceptions/error-code';
import { DeleteGroupUsecase } from '../group/delete-group-usecase';

@Injectable()
export class RemoveGroupMemberUsecase {
  constructor(
    private readonly groupMemberRepository: GroupMemberRepository,
    private readonly getUserUsecase: GetUserUsecase,
    private readonly groupRepository: GroupRepository,
    private readonly deleteGroupUsecase: DeleteGroupUsecase,
  ) {}

  @Transactional()
  async call(group: GroupModel, owner: UserModel, member: UserModel): Promise<boolean> {
    if (group.ownerId != owner.id) {
      throw new LogicalException(ErrorCode.GROUP_NOT_BELONG_TO_YOUR_OWN, 'Group not belong to your own.', undefined);
    }

    if (!(await this.groupMemberRepository.checkExist(group, member))) {
      throw new LogicalException(ErrorCode.GROUP_MEMBER_NOT_FOUND, 'Group member not found.', undefined);
    }

    if (group.ownerId == member.id) {
      if ((await this.groupMemberRepository.count(group)) == 1) {
        await this.deleteGroupUsecase.call(group);

        return true;
      }

      const newOwner = await this.randomNewOwner(group);
      await this.groupRepository.changeOwner(group, newOwner);
    }

    await this.groupMemberRepository.remove(group, member);

    if ((await this.groupMemberRepository.count(group)) == 0) {
      await this.groupRepository.delete(group);
    }

    return true;
  }

  private async randomNewOwner(group: GroupModel): Promise<UserModel> {
    const randomList = (
      await this.groupMemberRepository.list(
        new PaginationParams(1, 3, false, false),
        new SortParams(undefined, undefined),
        group,
        undefined,
      )
    ).data.filter((item) => item.memberId != group.ownerId);

    const newOwnerId = randomList[Math.floor(Math.random() * randomList.length)].memberId;

    return (await this.getUserUsecase.call({ id: newOwnerId })) ?? throwError();
  }
}
