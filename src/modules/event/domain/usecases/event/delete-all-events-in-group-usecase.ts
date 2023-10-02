import { Injectable } from '@nestjs/common';
import { GroupModel } from 'src/modules/group/domain/models/group-model';
import { EventRepository } from '../../repositories/event-repository';

@Injectable()
export class DeleteAllEventsInGroupUsecase {
  constructor(private readonly eventRepository: EventRepository) {}

  async call(group: GroupModel): Promise<void> {
    await this.eventRepository.deleteAllByGroup(group);
  }
}
