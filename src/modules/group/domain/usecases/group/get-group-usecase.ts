import { Injectable } from '@nestjs/common';
import { GetGroupBody } from '../../interfaces/group-interface';
import { GroupModel } from '../../models/group-model';
import { GroupRepository } from '../../repositories/group-repository';

@Injectable()
export class GetGroupUsecase {
  constructor(private readonly groupRepository: GroupRepository) {}
  async call(body: GetGroupBody): Promise<GroupModel | undefined> {
    const { id } = body;
    if (id) {
      return await this.groupRepository.get(body);
    }
  }
}
