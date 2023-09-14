import { UserModel } from 'src/modules/user/domain/models/user-model';
import { GroupRepository } from '../../repositories/group-repository';
import { GroupModel } from '../../models/group-model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ChangeGroupOwnerUsecase {
  constructor(private readonly groupRepository: GroupRepository) {}

  async call(group: GroupModel, newOwner: UserModel): Promise<void> {
    await this.groupRepository.changeOwner(group, newOwner);
  }
}
