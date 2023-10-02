import { EventMemberRepository } from '../../repositories/event-member-repository';
import { EventModel } from '../../model/event-model';
import { UserModel } from 'src/modules/user/domain/models/user-model';
import { EventStatus } from 'src/modules/event/enum/event-status-enum';
import { EventScope } from 'src/modules/event/enum/event-scope-enum';
import { CheckGroupMemberExistsUsecase } from 'src/modules/group/domain/usecases/group-member/check-group-member-exists-usecase';
import { throwError } from 'src/core/helpers/utils';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CheckMemberCanJoinEventUsecase {
  constructor(
    private readonly eventMemberRepository: EventMemberRepository,
    private readonly checkGroupMemberExistsUsecase: CheckGroupMemberExistsUsecase,
  ) {}

  async call(event: EventModel, member: UserModel): Promise<boolean> {
    if (event.scope == EventScope.Group) {
      if (!(await this.checkGroupMemberExistsUsecase.call(event.group ?? throwError(), member))) {
        return false;
      }
    }

    if (await this.eventMemberRepository.checkExist(event, member)) {
      return false;
    }

    if (event.getStatus() != EventStatus.isComing) {
      return false;
    }

    if (!(await this.eventMemberRepository.checkMemberJoinAvailableTime(member, event))) {
      return false;
    }

    if (event.currentCount + 1 > event.maxCount) {
      return false;
    }

    return true;
  }
}
