import { Injectable } from '@nestjs/common';
import { GroupMemberRepository } from '../../repositories/group-member-repository';
import { DeleteAllGroupMemberInput } from '../../inputs/group-member-input';

@Injectable()
export class DeleteAllGroupMemberUsecase {
  constructor(private readonly groupMemberRepository: GroupMemberRepository) {}
  async call(body: DeleteAllGroupMemberInput): Promise<void> {
    await this.groupMemberRepository.deleteAll(body);
  }
}
