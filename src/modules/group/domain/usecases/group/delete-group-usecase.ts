import { DeleteAllEventsInGroupUsecase } from 'src/modules/event/domain/usecases/event/delete-all-events-in-group-usecase';
import { DeleteEventMembersInGroupUsecase } from 'src/modules/event/domain/usecases/event-member/delete-event-members-in-group-usecase';
import { ErrorCode } from 'src/exceptions/error-code';
import { GroupModel } from '../../models/group-model';
import { GroupRepository } from '../../repositories/group-repository';
import { Injectable } from '@nestjs/common';
import { LogicalException } from 'src/exceptions/logical-exception';
import { DeleteAllGroupMemberUsecase } from '../group-member/delete-all-group-member-usecase';
import { Transactional } from 'typeorm-transactional';
import { UserModel } from 'src/modules/user/domain/models/user-model';
import { GetEventsUsecase } from 'src/modules/event/domain/usecases/event/get-events-usecase';
import { PaginationParams } from 'src/core/models/pagination-params';
import { SortParams } from 'src/core/models/sort-params';
import { EventStatus } from 'src/modules/event/enum/event-status-enum';
import { EventScope } from 'src/modules/event/enum/event-scope-enum';
import { throwError } from 'src/core/helpers/utils';

@Injectable()
export class DeleteGroupUsecase {
  constructor(
    private readonly removeAllGroupMemberUsecase: DeleteAllGroupMemberUsecase,
    private readonly groupRepository: GroupRepository,
    private readonly deleteEventMembersInGroupUsecase: DeleteEventMembersInGroupUsecase,
    private readonly deleteAllEventsInGroupUsecase: DeleteAllEventsInGroupUsecase,
    private readonly getEventsUsecase: GetEventsUsecase,
  ) {}

  @Transactional()
  async call(group: GroupModel, owner: UserModel | undefined): Promise<void> {
    if (owner && group.ownerId != owner.id) {
      throw new LogicalException(ErrorCode.GROUP_NOT_BELONG_TO_YOUR_OWN, 'Group not belong to your own.', undefined);
    }

    const events = await this.getEventsUsecase.call(
      new PaginationParams(1, 1, true, undefined),
      new SortParams(undefined, undefined),
      undefined,
      group,
      EventStatus.isHappening,
      EventScope.Group,
      undefined,
    );
    if (events.totalCount ?? throwError() > 0) {
      throw new LogicalException(
        ErrorCode.GROUP_CAN_NOT_DELETE,
        'Can not delete because event group is happening.',
        undefined,
      );
    }

    await this.deleteEventMembersInGroupUsecase.call(group, undefined, undefined);
    await this.deleteAllEventsInGroupUsecase.call(group);
    await this.removeAllGroupMemberUsecase.call({ group: group });
    await this.groupRepository.delete(group);
  }
}
