import { Injectable } from '@nestjs/common';
import { GroupModel } from 'src/modules/group/domain/models/group-model';
import { CheckEventAvailableCreate } from '../../types/event-body-type';
import { EventRepository } from '../../repositories/event-repository';
import { EventScope } from 'src/modules/event/enum/event-scope-enum';

@Injectable()
export class CheckEventAvailableCreateUsecase {
  constructor(private readonly eventRepository: EventRepository) {}

  async call(group: GroupModel, body: CheckEventAvailableCreate): Promise<boolean> {
    const { startTime, finishTime, scope } = body;

    if (startTime.getTime() > finishTime.getTime()) {
      return false;
    }

    if (startTime.getTime() < new Date().getTime() || finishTime.getTime() < new Date().getTime()) {
      return false;
    }

    switch (scope) {
      case EventScope.Public:
        return true;
      case EventScope.Group:
        return await this.eventRepository.checkAvailableTime(group, body);
    }
  }
}
