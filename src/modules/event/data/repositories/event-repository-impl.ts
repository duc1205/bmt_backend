import { PageList } from 'src/core/models/page-list';
import { PaginationParams } from 'src/core/models/pagination-params';
import { SortParams } from 'src/core/models/sort-params';
import { GroupModel } from 'src/modules/group/domain/models/group-model';
import { UserModel } from 'src/modules/user/domain/models/user-model';
import { EventModel } from '../../domain/model/event-model';
import { EventRepository } from '../../domain/repositories/event-repository';
import { CheckEventAvailableCreate, GetEvent, UpdateEvent } from '../../domain/types/event-body-type';
import { EventStatus } from '../../enum/event-status-enum';
import { EventDatasource } from '../datasources/event-datasource';
import { EventScope } from '../../enum/event-scope-enum';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EventRepositoryImpl extends EventRepository {
  constructor(private readonly eventDatasource: EventDatasource) {
    super();
  }

  async create(event: EventModel): Promise<void> {
    await this.eventDatasource.create(event);
  }

  async update(event: EventModel, body: UpdateEvent): Promise<void> {
    await this.eventDatasource.update(event, body);
  }

  async list(
    paginationParams: PaginationParams,
    sortParams: SortParams,
    user: UserModel | undefined,
    group: GroupModel | undefined,
    status: EventStatus | undefined,
    scope: EventScope | undefined,
    relations: string[] | undefined,
  ): Promise<PageList<EventModel>> {
    return await this.eventDatasource.list(paginationParams, sortParams, user, group, status, scope, relations);
  }

  async checkAvailableTime(group: GroupModel, body: CheckEventAvailableCreate): Promise<boolean> {
    return await this.eventDatasource.checkAvailableTime(group, body);
  }

  async get(body: GetEvent, relations: string[] | undefined): Promise<EventModel | undefined> {
    return await this.eventDatasource.get(body, relations);
  }
}
