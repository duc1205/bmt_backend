import { Injectable } from '@nestjs/common';
import { GroupRepository } from '../../repositories/group-repository';
import { UpdateGroupInput } from '../../inputs/group-input';
import { GroupModel } from '../../models/group-model';
import { throwError } from 'src/core/helpers/utils';

@Injectable()
export class UpdateGroupUsecase {
  constructor(private readonly groupRepository: GroupRepository) {}

  async call(group: GroupModel, body: UpdateGroupInput): Promise<GroupModel> {
    await this.groupRepository.update(group, body);

    return (await this.groupRepository.get({ id: group.id })) ?? throwError();
  }
}
