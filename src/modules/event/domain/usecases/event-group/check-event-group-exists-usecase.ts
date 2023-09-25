import { Injectable } from '@nestjs/common';
import { EventModel } from '../../model/event-model';
import { EventGroupRepository } from '../../repositories/event-group-repository';
import { GroupModel } from 'src/modules/group/domain/models/group-model';

@Injectable()
export class CheckEventGroupExistUsecase {
  constructor(private readonly eventGroupRepository: EventGroupRepository) {}

  async call(event: EventModel, group: GroupModel): Promise<boolean> {
    return await this.eventGroupRepository.checkExist(event, group);
  }
}
