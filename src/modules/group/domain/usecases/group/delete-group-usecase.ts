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

@Injectable()
export class DeleteGroupUsecase {
  constructor(
    private readonly removeAllGroupMemberUsecase: DeleteAllGroupMemberUsecase,
    private readonly groupRepository: GroupRepository,
    private readonly deleteEventMembersInGroupUsecase: DeleteEventMembersInGroupUsecase,
    private readonly deleteAllEventsInGroupUsecase: DeleteAllEventsInGroupUsecase,
  ) {}

  @Transactional()
  async call(group: GroupModel, owner: UserModel | undefined): Promise<void> {
    if (owner && group.ownerId != owner.id) {
      throw new LogicalException(ErrorCode.GROUP_NOT_BELONG_TO_YOUR_OWN, 'Group not belong to your own.', undefined);
    }

    await this.deleteEventMembersInGroupUsecase.call(group, undefined, undefined);
    await this.deleteAllEventsInGroupUsecase.call(group);
    await this.removeAllGroupMemberUsecase.call({ group: group });
    await this.groupRepository.delete(group);
  }
}
