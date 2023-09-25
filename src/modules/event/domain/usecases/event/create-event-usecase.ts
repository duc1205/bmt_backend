import { CheckEventAvailableCreateUsecase } from './check-event-available-create-usecase';
import { CreateEvent } from '../../types/event-body-type';
import { CreateEventGroupUsecase } from '../event-group/create-event-group-usecase';
import { ErrorCode } from 'src/exceptions/error-code';
import { EventModel } from '../../model/event-model';
import { EventRepository } from '../../repositories/event-repository';
import { EventScope } from 'src/modules/event/enum/event-scope-enum';
import { GroupModel } from 'src/modules/group/domain/models/group-model';
import { Injectable } from '@nestjs/common';
import { LogicalException } from 'src/exceptions/logical-exception';
import { throwError } from 'src/core/helpers/utils';
import { v4 as uuidV4 } from 'uuid';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class CreateEventUsecase {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly checkEventAvailableCreateUsecase: CheckEventAvailableCreateUsecase,
    private readonly createEventGroupUsecase: CreateEventGroupUsecase,
  ) {}

  @Transactional()
  async call(group: GroupModel | undefined, body: CreateEvent): Promise<EventModel> {
    const { scope } = body;
    const startTime = new Date(body.startTime);
    const finishTime = new Date(body.finishTime);

    if (startTime.getTime() >= finishTime.getTime()) {
      throw new LogicalException(ErrorCode.EVENT_TIME_INVALID, 'Start time must less than end time.', undefined);
    }

    if (startTime.getTime() < new Date().getTime() || finishTime.getTime() < new Date().getTime()) {
      throw new LogicalException(ErrorCode.EVENT_TIME_INVALID, 'Start time or end time is invalid.', undefined);
    }

    switch (scope) {
      case EventScope.Public:
        return await this.createEvent(body);

      case EventScope.Group:
        if (!group) {
          throw new LogicalException(ErrorCode.GROUP_NOT_FOUND, 'Group not found.', undefined);
        }

        if (!(await this.checkEventAvailableCreateUsecase.call(group, { finishTime, startTime, scope }))) {
          throw new LogicalException(ErrorCode.EVENT_CAN_NOT_CREATE, 'Event is not available to create.', undefined);
        }

        const event = await this.createEvent(body);
        await this.createEventGroupUsecase.call(event, group);

        return event;

      default:
        throwError();
    }
  }

  private async createEvent(body: CreateEvent): Promise<EventModel> {
    const { title, description, maxCount, startTime, finishTime, scope } = body;

    const event = new EventModel(
      uuidV4(),
      title,
      description,
      0,
      maxCount,
      startTime,
      finishTime,
      scope,
      new Date(),
      new Date(),
    );

    await this.eventRepository.create(event);
    return event;
  }
}
