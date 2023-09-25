import { ApiProperty } from '@nestjs/swagger';
import { DomainModel } from 'src/core/models/domain-model';
import { UserModel } from 'src/modules/user/domain/models/user-model';
import { EventModel } from './event-model';

export class EventMemberModel extends DomainModel {
  @ApiProperty()
  public readonly id: string;

  @ApiProperty()
  public readonly memberId: string;

  @ApiProperty()
  public readonly eventId: string;

  @ApiProperty({ name: 'created_at' })
  public readonly createdAt: Date;

  @ApiProperty({ name: 'updated_at' })
  public readonly updatedAt: Date;

  public readonly member: UserModel | undefined;

  public readonly event: EventModel | undefined;

  constructor(
    id: string,
    memberId: string,
    eventId: string,
    createdAt: Date,
    updatedAt: Date,
    member: UserModel | undefined,
    event: EventModel | undefined,
  ) {
    super();
    this.id = id;
    this.memberId = memberId;
    this.eventId = eventId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.member = member;
    this.event = event;
  }

  toJson(): Record<string, any> {
    return {
      id: this.id,
      member_id: this.memberId,
      event_id: this.eventId,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
      member: this.member?.toJson(),
      event: this.event?.toJson(),
    };
  }
}
