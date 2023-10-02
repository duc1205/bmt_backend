import { EventScope } from '../../enum/event-scope-enum';

export type EventInput = {
  id: string;
  title: string;
  description: string;
  currentCount: number;
  maxCount: number;
  startTime: Date;
  finishTime: Date;
  scope: EventScope;
};

export type CreateEventInput = Pick<
  EventInput,
  'title' | 'description' | 'maxCount' | 'startTime' | 'finishTime' | 'scope'
>;

export type UpdateEventInput = Partial<Pick<EventInput, 'title' | 'description' | 'currentCount'>>;

export type UpdateEventByUserInput = Partial<Pick<UpdateEventInput, 'title' | 'description'>>;

export type GetEventInput = Partial<Pick<EventInput, 'id'>>;

export type CheckEventAvailableCreateInput = Pick<EventInput, 'startTime' | 'finishTime'>;
