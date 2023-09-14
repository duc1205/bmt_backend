import { Injectable } from '@nestjs/common';
import { GroupMemberRepository } from '../../repositories/group-member-repository';
import { RemoveAllGroupMemberInterface } from '../../interfaces/group-member-interface';

@Injectable()
export class RemoveAllGroupMemberUsecase {
  constructor(private readonly groupMemberRepository: GroupMemberRepository) {}
  async call(body: RemoveAllGroupMemberInterface): Promise<void> {
    await this.groupMemberRepository.removeAll(body);
  }
}
