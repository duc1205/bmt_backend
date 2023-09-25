import { EventMemberRepository } from '../../repositories/event-member-repository';
import { EventModel } from '../../model/event-model';
import { UserModel } from 'src/modules/user/domain/models/user-model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CheckEventMemberExistUsecase {
  constructor(private readonly eventMemberRepository: EventMemberRepository) {}

  async call(event: EventModel, member: UserModel): Promise<boolean> {
    return await this.eventMemberRepository.checkExist(event, member);
  }
}
