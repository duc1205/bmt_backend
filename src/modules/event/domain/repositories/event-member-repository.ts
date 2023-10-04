import { GroupModel } from 'src/modules/group/domain/models/group-model';
import { EventStatus } from '../../enum/event-status-enum';
import { EventMemberModel } from '../model/event-member-model';
import { EventModel } from '../model/event-model';
import { UserModel } from 'src/modules/user/domain/models/user-model';
import { PaginationParams } from 'src/core/models/pagination-params';
import { SortParams } from 'src/core/models/sort-params';
import { PageList } from 'src/core/models/page-list';

export abstract class EventMemberRepository {
  abstract create(eventMember: EventMemberModel): Promise<void>;

  abstract checkExist(event: EventModel, member: UserModel): Promise<boolean>;

  abstract checkMemberJoinAvailableTime(member: UserModel, event: EventModel): Promise<boolean>;

  abstract get(
    event: EventModel,
    member: UserModel,
    relations: string[] | undefined,
  ): Promise<EventMemberModel | undefined>;

  abstract delete(eventMember: EventMemberModel): Promise<void>;

  abstract deleteInGroup(
    group: GroupModel,
    member: UserModel | undefined,
    status: EventStatus | undefined,
  ): Promise<void>;

  abstract list(
    paginationParams: PaginationParams,
    sortParams: SortParams,
    event: EventModel,
    relations: string[] | undefined,
  ): Promise<PageList<EventMemberModel>>;

  abstract deleteAllByEvent(event: EventModel): Promise<void>;

  abstract checkUserJoinEvents(user: UserModel, eventIds: string[]): Promise<Record<string, boolean>>;
}
