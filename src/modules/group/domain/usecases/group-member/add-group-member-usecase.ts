import { ErrorCode } from 'src/exceptions/error-code';
import { GroupMemberModel } from '../../models/group-member-model';
import { GroupMemberRepository } from '../../repositories/group-member-repository';
import { GroupModel } from '../../models/group-model';
import { Injectable } from '@nestjs/common';
import { LogicalException } from 'src/exceptions/logical-exception';
import { UserModel } from 'src/modules/user/domain/models/user-model';
import { v4 as uuidV4 } from 'uuid';

@Injectable()
export class AddGroupMemberUsecase {
  constructor(private readonly groupMemberRepository: GroupMemberRepository) {}

  async call(group: GroupModel, owner: UserModel, member: UserModel): Promise<GroupMemberModel> {
    if (group.ownerId != owner.id) {
      throw new LogicalException(ErrorCode.GROUP_NOT_BELONG_TO_YOUR_OWN, 'Group not belong to your own.', undefined);
    }

    if (await this.groupMemberRepository.checkExist(group, member)) {
      throw new LogicalException(ErrorCode.GROUP_MEMBER_EXISTS_ALREADY, 'Group member exists already.', undefined);
    }

    const groupMember = new GroupMemberModel(
      uuidV4(),
      group.id,
      member.id,
      new Date(),
      new Date(),
      undefined,
      undefined,
    );

    await this.groupMemberRepository.add(groupMember);

    return groupMember;
  }
}
