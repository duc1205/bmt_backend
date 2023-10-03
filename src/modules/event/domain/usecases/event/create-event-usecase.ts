import { CheckEventAvailableCreateUsecase } from './check-event-available-create-usecase';
import { CreateEventInput } from '../../inputs/event-input';
import { ErrorCode } from 'src/exceptions/error-code';
import { EventModel } from '../../model/event-model';
import { EventRepository } from '../../repositories/event-repository';
import { EventScope } from 'src/modules/event/enum/event-scope-enum';
import { GroupModel } from 'src/modules/group/domain/models/group-model';
import { Injectable } from '@nestjs/common';
import { LogicalException } from 'src/exceptions/logical-exception';
import { Transactional } from 'typeorm-transactional';
import { UserModel } from 'src/modules/user/domain/models/user-model';
import { v4 as uuidV4 } from 'uuid';
import { CreateEventMemberUsecase } from '../event-member/create-event-member-usecase';

@Injectable()
export class CreateEventUsecase {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly checkEventAvailableCreateUsecase: CheckEventAvailableCreateUsecase,
    private readonly createEventMemberUsecase: CreateEventMemberUsecase,
  ) {}

  @Transactional()
  async call(group: GroupModel | undefined, organizer: UserModel, body: CreateEventInput): Promise<EventModel> {
    const { scope, startTime, finishTime } = body;

    if (startTime.getTime() >= finishTime.getTime()) {
      throw new LogicalException(ErrorCode.EVENT_TIME_INVALID, 'Start time must less than end time.', undefined);
    }

    if (startTime.getTime() < new Date().getTime() || finishTime.getTime() < new Date().getTime()) {
      throw new LogicalException(ErrorCode.EVENT_TIME_INVALID, 'Start time or end time is invalid.', undefined);
    }

    if (scope == EventScope.Group && !group) {
      throw new LogicalException(ErrorCode.GROUP_NOT_FOUND, 'Group not found.', undefined);
    }

    if (!(await this.checkEventAvailableCreateUsecase.call(group, organizer, { finishTime, startTime }))) {
      throw new LogicalException(ErrorCode.EVENT_CAN_NOT_CREATE, 'Event is not available to create.', undefined);
    }

    const event = await this.createEvent(group, organizer, body);

    return event;
  }

  private async createEvent(
    group: GroupModel | undefined,
    organizer: UserModel,
    body: CreateEventInput,
  ): Promise<EventModel> {
    const { title, description, maxCount, startTime, finishTime, scope } = body;

    const event = new EventModel(
      uuidV4(),
      title,
      description,
      group?.id,
      organizer.id,
      0,
      maxCount,
      startTime,
      finishTime,
      scope,
      new Date(),
      new Date(),
      group,
      organizer,
    );

    await this.eventRepository.create(event);
    await this.createEventMemberUsecase.call(event, organizer);
    return event;
  }
}
