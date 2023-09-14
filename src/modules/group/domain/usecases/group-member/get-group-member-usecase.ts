import { Injectable } from '@nestjs/common';
import { GetGroupMemberBody } from '../../interfaces/group-member-interface';
import { GroupMemberRepository } from '../../repositories/group-member-repository';
import { GroupMemberModel } from '../../models/group-member-model';

@Injectable()
export class GetGroupMemberUsecase {
  constructor(private readonly groupMemberRepository: GroupMemberRepository) {}

  async call(body: GetGroupMemberBody): Promise<GroupMemberModel | undefined> {
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
