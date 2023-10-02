import { LogicalException } from 'src/exceptions/logical-exception';
import { EventModel } from '../../model/event-model';
import { EventRepository } from '../../repositories/event-repository';
import { UpdateEventInput } from '../../inputs/event-input';
import { ErrorCode } from 'src/exceptions/error-code';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UpdateEventUsecase {
  constructor(private readonly eventRepository: EventRepository) {}

  async call(event: EventModel, body: UpdateEventInput): Promise<void> {
    const { currentCount } = body;

    if (currentCount && (event.maxCount < currentCount || currentCount < 0)) {
      throw new LogicalException(ErrorCode.EVENT_CURRENT_COUNT_INVALID, 'Current count invalid.', undefined);
    }

    await this.eventRepository.update(event, body);
  }
}
