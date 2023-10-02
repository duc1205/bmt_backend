import { Injectable } from '@nestjs/common';
import { GetGroupInput } from '../../inputs/group-input';
import { GroupModel } from '../../models/group-model';
import { GroupRepository } from '../../repositories/group-repository';

@Injectable()
export class GetGroupUsecase {
  constructor(private readonly groupRepository: GroupRepository) {}
  async call(body: GetGroupInput): Promise<GroupModel | undefined> {
    const { id } = body;
    if (id) {
      return await this.groupRepository.get(body);
    }
  }
}
