import { Injectable } from '@nestjs/common';
import { GroupRepository } from '../../repositories/group-repository';
import { UpdateGroupInterface } from '../../interfaces/group-interface';
import { GroupModel } from '../../models/group-model';
import { throwError } from 'src/core/helpers/utils';

@Injectable()
export class UpdateGroupUsecase {
  constructor(private readonly groupRepository: GroupRepository) {}

  async call(group: GroupModel, body: UpdateGroupInterface): Promise<GroupModel> {
    await this.groupRepository.update(group, body);

    return (await this.groupRepository.get({ id: group.id })) ?? throwError();
  }
}
