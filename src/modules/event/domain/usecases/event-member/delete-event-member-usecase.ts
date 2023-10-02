import { ErrorCode } from 'src/exceptions/error-code';
import { EventMemberRepository } from '../../repositories/event-member-repository';
import { EventModel } from '../../model/event-model';
import { LogicalException } from 'src/exceptions/logical-exception';
import { UpdateEventUsecase } from '../event/update-event-usecase';
import { UserModel } from 'src/modules/user/domain/models/user-model';
import { Injectable } from '@nestjs/common';
import { EventStatus } from 'src/modules/event/enum/event-status-enum';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class DeleteEventMemberUsecase {
  constructor(
    private readonly eventMemberRepository: EventMemberRepository,
    private readonly updateEventUsecase: UpdateEventUsecase,
  ) {}

  @Transactional()
  async call(event: EventModel, member: UserModel): Promise<boolean> {
    if (event.getStatus() == EventStatus.isHappening || event.getStatus() == EventStatus.isFinished) {
      throw new LogicalException(
        ErrorCode.EVENT_MEMBER_CAN_NOT_DELETE,
        `Event on status ${event.getStatus()}`,
        undefined,
      );
    }

    if (event.organizerId == member.id) {
      throw new LogicalException(ErrorCode.EVENT_MEMBER_CAN_NOT_LEAVE, 'Organizer can not leave event.', undefined);
    }

    const eventMember = await this.eventMemberRepository.get(event, member, undefined);
    if (!eventMember) {
      throw new LogicalException(ErrorCode.EVENT_MEMBER_NOT_FOUND, 'Member not join event.', undefined);
    }

    await this.eventMemberRepository.delete(eventMember);

    await this.updateEventUsecase.call(event, { currentCount: event.currentCount - 1 });

    return true;
  }
}
