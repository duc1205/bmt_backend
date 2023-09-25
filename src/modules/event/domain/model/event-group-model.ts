import { ApiProperty } from '@nestjs/swagger';
import { DomainModel } from 'src/core/models/domain-model';
import { GroupModel } from 'src/modules/group/domain/models/group-model';
import { EventModel } from './event-model';

export class EventGroupModel extends DomainModel {
  @ApiProperty()
  public readonly id: string;

  @ApiProperty()
  public readonly groupId: string;

  @ApiProperty()
  public readonly eventId: string;

  @ApiProperty({ name: 'created_at' })
  public readonly createdAt: Date;

  @ApiProperty({ name: 'updated_at' })
  public readonly updatedAt: Date;

  public readonly group: GroupModel | undefined;

  public readonly event: EventModel | undefined;

  constructor(
    id: string,
    groupId: string,
    eventId: string,
    createdAt: Date,
    updatedAt: Date,
    group: GroupModel | undefined,
    event: EventModel | undefined,
  ) {
    super();
    this.id = id;
    this.groupId = groupId;
    this.eventId = eventId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.group = group;
    this.event = event;
  }

  toJson(): Record<string, any> {
    return {
      id: this.id,
      group_id: this.groupId,
      event_id: this.eventId,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
      event: this.event?.toJson(),
      group: this.group?.toJson(),
    };
  }
}
