import { PageList } from 'src/core/models/page-list';
import { PaginationParams } from 'src/core/models/pagination-params';
import { SortParams } from 'src/core/models/sort-params';
import { GroupModel } from 'src/modules/group/domain/models/group-model';
import { UserModel } from 'src/modules/user/domain/models/user-model';
import { EventModel } from '../../domain/model/event-model';
import { EventRepository } from '../../domain/repositories/event-repository';
import { CheckEventAvailableCreateInput, UpdateEventInput } from '../../domain/inputs/event-input';
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

  async update(event: EventModel, body: UpdateEventInput): Promise<void> {
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

  async checkAvailableTime(
    group: GroupModel | undefined,
    organizer: UserModel,
    body: CheckEventAvailableCreateInput,
  ): Promise<boolean> {
    return await this.eventDatasource.checkAvailableTime(group, organizer, body);
  }

  async get(id: string, relations: string[] | undefined): Promise<EventModel | undefined> {
    return await this.eventDatasource.get(id, relations);
  }

  async deleteAllByGroup(group: GroupModel): Promise<void> {
    return await this.eventDatasource.deleteAllByGroup(group);
  }

  async delete(event: EventModel): Promise<void> {
    return await this.eventDatasource.delete(event);
  }
}
