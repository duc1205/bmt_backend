import { AddGroupMemberUsecase } from '../group-member/add-group-member-usecase';
import { CreateGroupInput } from '../../inputs/group-input';
import { GroupModel } from '../../models/group-model';
import { GroupRepository } from '../../repositories/group-repository';
import { Injectable } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';
import { UserModel } from 'src/modules/user/domain/models/user-model';
import { v4 as uuidV4 } from 'uuid';

@Injectable()
export class CreateGroupUsecase {
  constructor(
    private readonly groupRepository: GroupRepository,
    private readonly addGroupMemberUsecase: AddGroupMemberUsecase,
  ) {}

  @Transactional()
  async call(owner: UserModel, body: CreateGroupInput): Promise<GroupModel> {
    const { name, avatarPath } = body;
    const group = new GroupModel(uuidV4(), name, owner.id, avatarPath, new Date(), new Date(), undefined);

    await this.groupRepository.create(group);

    await this.addGroupMemberUsecase.call(group, owner, owner);

    return group;
  }
}
