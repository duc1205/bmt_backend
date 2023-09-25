import { CheckEventGroupExistUsecase } from './check-event-group-exists-usecase';
import { ErrorCode } from 'src/exceptions/error-code';
import { EventGroupModel } from '../../model/event-group-model';
import { EventGroupRepository } from '../../repositories/event-group-repository';
import { EventModel } from '../../model/event-model';
import { GroupModel } from 'src/modules/group/domain/models/group-model';
import { LogicalException } from 'src/exceptions/logical-exception';
import { v4 as uuidV4 } from 'uuid';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CreateEventGroupUsecase {
  constructor(
    private readonly checkEventGroupExistUsecase: CheckEventGroupExistUsecase,
    private readonly eventGroupRepository: EventGroupRepository,
  ) {}

  async call(event: EventModel, group: GroupModel): Promise<EventGroupModel> {
    if (await this.checkEventGroupExistUsecase.call(event, group)) {
      throw new LogicalException(ErrorCode.EVENT_MEMBER_EXISTED_ALREADY, 'Event member is existed already', undefined);
    }

    const eventGroup = new EventGroupModel(uuidV4(), group.id, event.id, new Date(), new Date(), undefined, undefined);
    await this.eventGroupRepository.create(eventGroup);

    return eventGroup;
  }
}
