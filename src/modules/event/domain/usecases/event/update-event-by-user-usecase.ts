import { ErrorCode } from 'src/exceptions/error-code';
import { EventModel } from '../../model/event-model';
import { EventRepository } from '../../repositories/event-repository';
import { EventScope } from 'src/modules/event/enum/event-scope-enum';
import { Injectable } from '@nestjs/common';
import { LogicalException } from 'src/exceptions/logical-exception';
import { throwError } from 'src/core/helpers/utils';
import { UpdateEventByUserInput } from '../../inputs/event-input';
import { UserModel } from 'src/modules/user/domain/models/user-model';

@Injectable()
export class UpdateEventByUserUsecase {
  constructor(private readonly eventRepository: EventRepository) {}

  async call(event: EventModel, implementer: UserModel, body: UpdateEventByUserInput): Promise<void> {
    switch (event.scope) {
      case EventScope.Group:
        if (event.organizerId != implementer.id && (event.group ?? throwError()).ownerId != implementer.id) {
          throw new LogicalException(ErrorCode.EVENT_NOT_BELONG_TO_YOU, 'Event not belong to you', undefined);
        }
        break;

      case EventScope.Public:
        if (event.organizerId != implementer.id) {
          throw new LogicalException(ErrorCode.EVENT_NOT_BELONG_TO_YOU, 'Event not belong to you', undefined);
        }
        break;
    }

    await this.eventRepository.update(event, { title: body.title, description: body.description });
  }
}
