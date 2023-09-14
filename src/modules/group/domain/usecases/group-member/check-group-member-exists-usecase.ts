import { Injectable } from '@nestjs/common';
import { GroupMemberRepository } from '../../repositories/group-member-repository';
import { GroupModel } from '../../models/group-model';
import { UserModel } from 'src/modules/user/domain/models/user-model';

@Injectable()
export class CheckGroupMemberExistsUsecase {
  constructor(private readonly groupMemberRepository: GroupMemberRepository) {}

  async call(group: GroupModel, member: UserModel): Promise<boolean> {
    return await this.groupMemberRepository.checkExist(group, member);
  }
}
