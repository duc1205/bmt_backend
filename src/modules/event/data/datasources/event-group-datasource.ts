import EventGroupEntity from './entities/event-group-entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { EventGroupModel } from '../../domain/model/event-group-model';
import { GroupModel } from 'src/modules/group/domain/models/group-model';
import { EventModel } from '../../domain/model/event-model';
import { GetEventGroup } from '../../domain/types/event-group-body-type';

@Injectable()
export class EventGroupDatasource {
  constructor(
    @InjectRepository(EventGroupEntity)
    private readonly eventGroupRepository: Repository<EventGroupEntity>,
  ) {}

  async create(eventGroup: EventGroupModel): Promise<void> {
    const entity = new EventGroupEntity();
    entity.id = eventGroup.id;
    entity.event_id = eventGroup.eventId;
    entity.group_id = eventGroup.groupId;
    entity.created_at = eventGroup.createdAt;
    entity.updated_at = eventGroup.updatedAt;

    await this.eventGroupRepository.insert(entity);
  }

  async checkExist(event: EventModel, group: GroupModel): Promise<boolean> {
    return (await this.eventGroupRepository.count({ where: { event_id: event.id, group_id: group.id } })) > 0;
  }

  async get(body: GetEventGroup, relations: string[] | undefined): Promise<EventGroupModel | undefined> {
    const condition: FindOptionsWhere<EventGroupEntity> = {};

    if (body.id) {
      condition.id = body.id;
    }

    if (body.event) {
      condition.event_id = body.event.id;
    }

    return (await this.eventGroupRepository.findOne({ where: condition, relations: relations }))?.toModel();
  }
}
