import { CheckMemberCanJoinEventUsecase } from './check-member-can-join-event-usecase';
import { ErrorCode } from 'src/exceptions/error-code';
import { EventMemberModel } from '../../model/event-member-model';
import { EventMemberRepository } from '../../repositories/event-member-repository';
import { EventModel } from '../../model/event-model';
import { EventStatus } from 'src/modules/event/enum/event-status-enum';
import { Injectable } from '@nestjs/common';
import { LogicalException } from 'src/exceptions/logical-exception';
import { UpdateEventUsecase } from '../event/update-event-usecase';
import { UserModel } from 'src/modules/user/domain/models/user-model';
import { v4 as uuidV4 } from 'uuid';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class CreateEventMemberUsecase {
  constructor(
    private readonly checkMemberCanJoinEventUsecase: CheckMemberCanJoinEventUsecase,
    private readonly eventMemberRepository: EventMemberRepository,
    private readonly updateEventUsecase: UpdateEventUsecase,
  ) {}

  @Transactional()
  async call(event: EventModel, member: UserModel): Promise<EventMemberModel> {
    if (event.getStatus() != EventStatus.isComing) {
      throw new LogicalException(
        ErrorCode.EVENT_MEMBER_CAN_NOT_JOIN_EVENT,
        'Can not join happening or finished event.',
        undefined,
      );
    }

    if (await this.eventMemberRepository.get(event, member, undefined)) {
      throw new LogicalException(ErrorCode.EVENT_MEMBER_EXISTED_ALREADY, 'Member joined event.', undefined);
    }

    if (!(await this.checkMemberCanJoinEventUsecase.call(event, member))) {
      throw new LogicalException(ErrorCode.EVENT_MEMBER_CAN_NOT_JOIN_EVENT, 'Member can not join event', undefined);
    }

    const eventMember = new EventMemberModel(
      uuidV4(),
      member.id,
      event.id,
      new Date(),
      new Date(),
      undefined,
      undefined,
    );
    await this.eventMemberRepository.create(eventMember);

    await this.updateEventUsecase.call(event, { currentCount: event.currentCount + 1 });

    return eventMember;
  }
}
