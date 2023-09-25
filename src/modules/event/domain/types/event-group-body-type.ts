import { GroupModel } from 'src/modules/group/domain/models/group-model';
import { EventModel } from '../model/event-model';

export type EventGroupBodyType = {
  id: string;
  group: GroupModel;
  event: EventModel;
};

export type GetEventGroup = Partial<Pick<EventGroupBodyType, 'id' | 'event'>>;
