import { EventMemberRepository } from '../../repositories/event-member-repository';
import { EventModel } from '../../model/event-model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DeleteEventMembersByEventUsecase {
  constructor(private readonly eventMemberRepository: EventMemberRepository) {}

  async call(event: EventModel): Promise<boolean> {
    await this.eventMemberRepository.deleteAllByEvent(event);
    return true;
  }
}
