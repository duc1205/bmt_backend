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
import { GetEventsUsecase } from 'src/modules/event/domain/usecases/event/get-events-usecase';
import { EventStatus } from 'src/modules/event/enum/event-status-enum';
import { DeleteEventMembersInGroupUsecase } from 'src/modules/event/domain/usecases/event-member/delete-event-members-in-group-usecase';

@Injectable()
export class DeleteGroupMemberUsecase {
  constructor(
    private readonly groupMemberRepository: GroupMemberRepository,
    private readonly getUserUsecase: GetUserUsecase,
    private readonly groupRepository: GroupRepository,
    private readonly deleteGroupUsecase: DeleteGroupUsecase,
    private readonly getListEventUsecase: GetEventsUsecase,
    private readonly deleteEventMembersInGroupUsecase: DeleteEventMembersInGroupUsecase,
  ) {}

  @Transactional()
  async call(group: GroupModel, implementer: UserModel, member: UserModel): Promise<boolean> {
    if (implementer.id != group.ownerId && member.id != implementer.id) {
      throw new LogicalException(ErrorCode.EVENT_CAN_NOT_DELETE, 'Group not belong to you', undefined);
    }

    if (!(await this.groupMemberRepository.checkExist(group, member))) {
      throw new LogicalException(ErrorCode.GROUP_MEMBER_NOT_FOUND, 'Group member not found.', undefined);
    }

    const happeningEvent = await this.getListEventUsecase.call(
      new PaginationParams(1, 1, true, true),
      new SortParams(undefined, undefined),
      member,
      undefined,
      EventStatus.isHappening,
      undefined,
      undefined,
    );
    if ((happeningEvent.totalCount ?? throwError()) >= 1) {
      throw new LogicalException(ErrorCode.EVENT_MEMBER_CAN_NOT_REMOVE_USER, 'User having happening event.', undefined);
    }

    await this.deleteEventMembersInGroupUsecase.call(group, member, EventStatus.isComing);

    if (group.ownerId == member.id) {
      if (
        (
          await this.groupMemberRepository.list(
            new PaginationParams(undefined, undefined, true, true),
            new SortParams(undefined, undefined),
            group,
            undefined,
          )
        ).totalCount == 1
      ) {
        await this.deleteGroupUsecase.call(group, undefined);

        return true;
      }

      const newOwner = await this.randomNewOwner(group);
      await this.groupRepository.changeOwner(group, newOwner);
    }

    await this.groupMemberRepository.delete(group, member);

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
