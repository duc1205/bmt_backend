import { Injectable } from '@nestjs/common';
import { GetGroupMemberInput } from '../../inputs/group-member-input';
import { GroupMemberRepository } from '../../repositories/group-member-repository';
import { GroupMemberModel } from '../../models/group-member-model';

@Injectable()
export class GetGroupMemberUsecase {
  constructor(private readonly groupMemberRepository: GroupMemberRepository) {}

  async call(body: GetGroupMemberInput): Promise<GroupMemberModel | undefined> {
    const { id, group, member } = body;

    if (id) {
      return await this.groupMemberRepository.get({ id: id });
    }

    if (group && member) {
      return await this.groupMemberRepository.get({ group: group, member: member });
    }

    return undefined;
  }
}
