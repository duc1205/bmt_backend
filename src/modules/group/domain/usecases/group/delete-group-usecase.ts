import { ErrorCode } from 'src/exceptions/error-code';
import { GroupModel } from '../../models/group-model';
import { GroupRepository } from '../../repositories/group-repository';
import { LogicalException } from 'src/exceptions/logical-exception';
import { RemoveAllGroupMemberUsecase } from '../group-member/remove-all-group-member-usecase';
import { Transactional } from 'typeorm-transactional';
import { UserModel } from 'src/modules/user/domain/models/user-model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DeleteGroupUsecase {
  constructor(
    private readonly removeAllGroupMemberUsecase: RemoveAllGroupMemberUsecase,
    private readonly groupRepository: GroupRepository,
  ) {}

  @Transactional()
  async call(group: GroupModel, owner?: UserModel): Promise<void> {
    if (owner && group.ownerId != owner.id) {
      throw new LogicalException(ErrorCode.GROUP_NOT_BELONG_TO_YOUR_OWN, 'Group not belong to your own.', undefined);
    }

    await this.removeAllGroupMemberUsecase.call({ group: group });
    await this.groupRepository.delete(group);
  }
}
