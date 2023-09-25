import { GroupModel } from 'src/modules/group/domain/models/group-model';
import { EventGroupModel } from '../model/event-group-model';
import { EventModel } from '../model/event-model';
import { GetEventGroup } from '../types/event-group-body-type';

export abstract class EventGroupRepository {
  abstract create(eventGroup: EventGroupModel): Promise<void>;

  abstract checkExist(event: EventModel, group: GroupModel): Promise<boolean>;

  abstract get(body: GetEventGroup, relations: string[] | undefined): Promise<EventGroupModel | undefined>;
}
