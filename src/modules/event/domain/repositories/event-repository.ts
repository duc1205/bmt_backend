import { EventModel } from '../model/event-model';
import { GroupModel } from 'src/modules/group/domain/models/group-model';
import { PageList } from 'src/core/models/page-list';
import { PaginationParams } from 'src/core/models/pagination-params';
import { SortParams } from 'src/core/models/sort-params';
import { UserModel } from 'src/modules/user/domain/models/user-model';
import { CheckEventAvailableCreateInput, UpdateEventInput } from '../inputs/event-input';
import { EventStatus } from '../../enum/event-status-enum';
import { EventScope } from '../../enum/event-scope-enum';

export abstract class EventRepository {
  abstract create(event: EventModel): Promise<void>;

  abstract update(event: EventModel, body: UpdateEventInput): Promise<void>;

  abstract list(
    paginationParams: PaginationParams,
    sortParams: SortParams,
    user: UserModel | undefined,
    group: GroupModel | undefined,
    status: EventStatus | undefined,
    scope: EventScope | undefined,
    relation: string[] | undefined,
  ): Promise<PageList<EventModel>>;

  abstract checkAvailableTime(
    group: GroupModel | undefined,
    organizer: UserModel,
    body: CheckEventAvailableCreateInput,
  ): Promise<boolean>;

  abstract get(id: string, relations: string[] | undefined): Promise<EventModel | undefined>;

  abstract deleteAllByGroup(group: GroupModel): Promise<void>;

  abstract delete(event: EventModel): Promise<void>;
}
