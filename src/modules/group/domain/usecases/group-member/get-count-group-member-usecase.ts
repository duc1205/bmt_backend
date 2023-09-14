import { GroupMemberRepository } from '../../repositories/group-member-repository';
import { GroupModel } from '../../models/group-model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetCountGroupMembersUsecase {
  constructor(private readonly groupMemberRepository: GroupMemberRepository) {}

  async call(group: GroupModel): Promise<number> {
    return await this.groupMemberRepository.count(group);
  }
}
