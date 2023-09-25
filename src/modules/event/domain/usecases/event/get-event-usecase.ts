import { UserModel } from 'src/modules/user/domain/models/user-model';
import { EventModel } from '../../model/event-model';
import { EventRepository } from '../../repositories/event-repository';
import { GetEvent } from '../../types/event-body-type';
import { EventScope } from 'src/modules/event/enum/event-scope-enum';
import { GetEventGroupUsecase } from '../event-group/get-event-group-usecase';
import { GetGroupMemberUsecase } from 'src/modules/group/domain/usecases/group-member/get-group-member-usecase';
import { throwError } from 'src/core/helpers/utils';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetEventUsecase {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly getEventGroupUsecase: GetEventGroupUsecase,
    private readonly getGroupMemberUsecase: GetGroupMemberUsecase,
  ) {}

  async call(
    body: GetEvent,
    user: UserModel | undefined,
    relations: string[] | undefined,
  ): Promise<EventModel | undefined> {
    const event = await this.eventRepository.get(body, relations);
    if (event && event.scope == EventScope.Group && user) {
      const eventGroup = await this.getEventGroupUsecase.call({ event: event }, ['group']);

      const userGroup = await this.getGroupMemberUsecase.call({
        group: eventGroup?.group ?? throwError(),
        member: user,
      });

      return userGroup ? event : undefined;
    }

    return event;
  }
}
