import { EventMemberRepository } from '../../repositories/event-member-repository';
import { UserModel } from 'src/modules/user/domain/models/user-model';
import { Injectable } from '@nestjs/common';
import { EventStatus } from 'src/modules/event/enum/event-status-enum';
import { GroupModel } from 'src/modules/group/domain/models/group-model';

@Injectable()
export class DeleteEventMembersInGroupUsecase {
  constructor(private readonly eventMemberRepository: EventMemberRepository) {}

  async call(group: GroupModel, member: UserModel | undefined, status: EventStatus | undefined): Promise<boolean> {
    await this.eventMemberRepository.deleteInGroup(group, member, status);
    return true;
  }
}
