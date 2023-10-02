import { UserModel } from 'src/modules/user/domain/models/user-model';
import { EventModel } from '../../model/event-model';
import { EventRepository } from '../../repositories/event-repository';
import { GetEventInput } from '../../inputs/event-input';
import { EventScope } from 'src/modules/event/enum/event-scope-enum';
import { GetGroupMemberUsecase } from 'src/modules/group/domain/usecases/group-member/get-group-member-usecase';
import { throwError } from 'src/core/helpers/utils';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetEventUsecase {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly getGroupMemberUsecase: GetGroupMemberUsecase,
  ) {}

  async call(
    body: GetEventInput,
    user: UserModel | undefined,
    relations: string[] | undefined,
  ): Promise<EventModel | undefined> {
    let event;
    if (body.id) {
      event = await this.eventRepository.get(body.id, ['group'].concat(relations ?? []));
      if (event && event.scope == EventScope.Group && user) {
        const userGroup = await this.getGroupMemberUsecase.call({
          group: event.group ?? throwError(),
          member: user,
        });

        return userGroup ? event : undefined;
      }
    }

    return event;
  }
}
