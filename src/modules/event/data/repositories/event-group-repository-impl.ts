import { GroupModel } from 'src/modules/group/domain/models/group-model';
import { EventGroupModel } from '../../domain/model/event-group-model';
import { EventModel } from '../../domain/model/event-model';
import { EventGroupRepository } from '../../domain/repositories/event-group-repository';
import { EventGroupDatasource } from '../datasources/event-group-datasource';
import { GetEventGroup } from '../../domain/types/event-group-body-type';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EventGroupRepositoryImpl extends EventGroupRepository {
  constructor(private readonly eventGroupDatasource: EventGroupDatasource) {
    super();
  }

  async create(eventGroup: EventGroupModel): Promise<void> {
    await this.eventGroupDatasource.create(eventGroup);
  }

  async checkExist(event: EventModel, group: GroupModel): Promise<boolean> {
    return this.eventGroupDatasource.checkExist(event, group);
  }

  async get(body: GetEventGroup, relations: string[] | undefined): Promise<EventGroupModel | undefined> {
    return this.eventGroupDatasource.get(body, relations);
  }
}
