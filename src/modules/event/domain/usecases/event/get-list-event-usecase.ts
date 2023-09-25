import { PaginationParams } from 'src/core/models/pagination-params';
import { EventRepository } from '../../repositories/event-repository';
import { SortParams } from 'src/core/models/sort-params';
import { UserModel } from 'src/modules/user/domain/models/user-model';
import { GroupModel } from 'src/modules/group/domain/models/group-model';
import { PageList } from 'src/core/models/page-list';
import { EventModel } from '../../model/event-model';
import { EventStatus } from 'src/modules/event/enum/event-status-enum';
import { EventScope } from 'src/modules/event/enum/event-scope-enum';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetListEventUsecase {
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
