import { EventMemberModel } from '../model/event-member-model';
import { EventModel } from '../model/event-model';
import { UserModel } from 'src/modules/user/domain/models/user-model';

export abstract class EventMemberRepository {
  abstract create(eventMember: EventMemberModel): Promise<void>;

  abstract checkExist(event: EventModel, member: UserModel): Promise<boolean>;

  abstract checkMemberJoinAvailableTime(member: UserModel, event: EventModel): Promise<boolean>;
}
