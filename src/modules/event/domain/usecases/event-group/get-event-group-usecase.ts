import { Injectable } from '@nestjs/common';
import { EventGroupModel } from '../../model/event-group-model';
import { EventGroupRepository } from '../../repositories/event-group-repository';
import { GetEventGroup } from '../../types/event-group-body-type';

@Injectable()
export class GetEventGroupUsecase {
  constructor(private readonly eventGroupRepository: EventGroupRepository) {}

  async call(body: GetEventGroup, relations: string[] | undefined): Promise<EventGroupModel | undefined> {
    if (Object.keys(body).length == 0) {
      return undefined;
    }

    return await this.eventGroupRepository.get(body, relations);
  }
}
