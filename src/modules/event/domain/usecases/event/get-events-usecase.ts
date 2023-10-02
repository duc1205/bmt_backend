import { EventModel } from '../../model/event-model';
import { EventRepository } from '../../repositories/event-repository';
import { EventScope } from 'src/modules/event/enum/event-scope-enum';
import { EventStatus } from 'src/modules/event/enum/event-status-enum';
import { GroupModel } from 'src/modules/group/domain/models/group-model';
import { Injectable } from '@nestjs/common';
import { PageList } from 'src/core/models/page-list';
import { PaginationParams } from 'src/core/models/pagination-params';
import { SortParams } from 'src/core/models/sort-params';
import { UserModel } from 'src/modules/user/domain/models/user-model';

@Injectable()
export class GetEventsUsecase {
  constructor(private readonly eventRepository: EventRepository) {}

  async call(
    paginationParams: PaginationParams,
    sortParams: SortParams,
    user: UserModel | undefined,
    group: GroupModel | undefined,
    status: EventStatus | undefined,
    scope: EventScope | undefined,
    relation: string[] | undefined,
  ): Promise<PageList<EventModel>> {
    return await this.eventRepository.list(paginationParams, sortParams, user, group, status, scope, relation);
  }
}
