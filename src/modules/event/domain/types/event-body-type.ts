import { EventScope } from '../../enum/event-scope-enum';

export type EventBodyType = {
  id: string;
  title: string;
  description: string;
  currentCount: number;
  maxCount: number;
  startTime: Date;
  finishTime: Date;
  scope: EventScope;
};

export type CreateEvent = Pick<
  EventBodyType,
  'title' | 'description' | 'maxCount' | 'startTime' | 'finishTime' | 'scope'
>;

export type UpdateEvent = Partial<Pick<EventBodyType, 'title' | 'description' | 'currentCount'>>;

export type GetEvent = Partial<Pick<EventBodyType, 'id'>>;

export type CheckEventAvailableCreate = Pick<EventBodyType, 'startTime' | 'finishTime' | 'scope'>;
