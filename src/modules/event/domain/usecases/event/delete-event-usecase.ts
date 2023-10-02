import { DeleteEventMembersByEventUsecase } from '../event-member/delete-event-members-by-event-usecase';
import { ErrorCode } from 'src/exceptions/error-code';
import { EventModel } from '../../model/event-model';
import { EventRepository } from '../../repositories/event-repository';
import { EventStatus } from 'src/modules/event/enum/event-status-enum';
import { Injectable } from '@nestjs/common';
import { LogicalException } from 'src/exceptions/logical-exception';
import { Transactional } from 'typeorm-transactional';
import { UserModel } from 'src/modules/user/domain/models/user-model';

@Injectable()
export class DeleteEventUsecase {
  constructor(
    private readonly deleteEventMembersByEventUsecase: DeleteEventMembersByEventUsecase,
    private readonly eventRepository: EventRepository,
  ) {}

  @Transactional()
  async call(event: EventModel, organizer: UserModel | undefined): Promise<void> {
    if (event.getStatus() != EventStatus.isComing) {
      throw new LogicalException(ErrorCode.EVENT_CAN_NOT_DELETE, 'Event on status happening or finished', undefined);
    }

    if (organizer && event.organizerId != organizer.id) {
      throw new LogicalException(ErrorCode.EVENT_NOT_BELONG_TO_YOU, 'Event not belong to you.', undefined);
    }

    await this.deleteEventMembersByEventUsecase.call(event);
    await this.eventRepository.delete(event);
  }
}
