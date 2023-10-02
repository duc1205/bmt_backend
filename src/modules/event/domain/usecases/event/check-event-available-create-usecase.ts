import { Injectable } from '@nestjs/common';
import { GroupModel } from 'src/modules/group/domain/models/group-model';
import { CheckEventAvailableCreateInput } from '../../inputs/event-input';
import { EventRepository } from '../../repositories/event-repository';
import { UserModel } from 'src/modules/user/domain/models/user-model';

@Injectable()
export class CheckEventAvailableCreateUsecase {
  constructor(private readonly eventRepository: EventRepository) {}

  async call(
    group: GroupModel | undefined,
    organizer: UserModel,
    body: CheckEventAvailableCreateInput,
  ): Promise<boolean> {
    const { startTime, finishTime } = body;

    if (startTime.getTime() > finishTime.getTime()) {
      return false;
    }

    if (startTime.getTime() < new Date().getTime() || finishTime.getTime() < new Date().getTime()) {
      return false;
    }
    return await this.eventRepository.checkAvailableTime(group, organizer, body);
  }
}
