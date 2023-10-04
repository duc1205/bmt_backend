import { UserModel } from 'src/modules/user/domain/models/user-model';
import { EventMemberRepository } from '../../repositories/event-member-repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CheckUserJoinEventsUsecase {
  constructor(private readonly eventMemberRepository: EventMemberRepository) {}

  async call(user: UserModel, eventIds: string[]): Promise<Record<string, boolean>> {
    const normalizeEventIds = [...new Set(eventIds)];
    return await this.eventMemberRepository.checkUserJoinEvents(user, normalizeEventIds);
  }
}
