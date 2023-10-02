import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DomainModel } from 'src/core/models/domain-model';
import { EventScope } from '../../enum/event-scope-enum';
import { EventStatus } from '../../enum/event-status-enum';
import { GroupModel } from 'src/modules/group/domain/models/group-model';
import { UserModel } from 'src/modules/user/domain/models/user-model';

export class EventModel extends DomainModel {
  @ApiProperty()
  public readonly id: string;

  @ApiProperty()
  public readonly title: string;

  @ApiProperty()
  public readonly description: string;

  @ApiPropertyOptional()
  public readonly groupId: string | undefined;

  @ApiProperty()
  public readonly organizerId: string;

  @ApiProperty({ name: 'current_count' })
  public readonly currentCount: number;

  @ApiProperty({ name: 'max_count' })
  public readonly maxCount: number;

  @ApiProperty({ name: 'start_time' })
  public readonly startTime: Date;

  @ApiProperty({ name: 'finish_time' })
  public readonly finishTime: Date;

  @ApiProperty()
  public readonly scope: EventScope;

  @ApiProperty({ name: 'created_at' })
  public readonly createdAt: Date;

  @ApiProperty({ name: 'updated_at' })
  public readonly updatedAt: Date;

  @ApiPropertyOptional()
  public readonly organizer: UserModel | undefined;

  @ApiPropertyOptional()
  public readonly group: GroupModel | undefined;

  constructor(
    id: string,
    title: string,
    description: string,
    groupId: string | undefined,
    organizerId: string,
    currentCount: number,
    maxCount: number,
    startTime: Date,
    finishTime: Date,
    scope: EventScope,
    createdAt: Date,
    updatedAt: Date,
    group: GroupModel | undefined,
    organizer: UserModel | undefined,
  ) {
    super();
    this.id = id;
    this.title = title;
    this.description = description;
    this.groupId = groupId;
    this.organizerId = organizerId;
    this.currentCount = currentCount;
    this.maxCount = maxCount;
    this.startTime = startTime;
    this.finishTime = finishTime;
    this.scope = scope;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.group = group;
    this.organizer = organizer;
  }

  toJson(): Record<string, any> {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      group_id: this.groupId,
      organizer_id: this.organizerId,
      current_count: this.currentCount,
      max_count: this.maxCount,
      start_time: this.startTime,
      finish_time: this.finishTime,
      scope: this.scope,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
      organizer: this.organizer?.toJson(),
      group: this.group?.toJson(),
    };
  }

  getStatus(): EventStatus {
    const currentTime = new Date().getTime();

    if (currentTime < this.startTime.getTime()) {
      return EventStatus.isComing;
    } else if (currentTime > this.startTime.getTime() && currentTime < this.finishTime.getTime()) {
      return EventStatus.isHappening;
    } else {
      return EventStatus.isFinished;
    }
  }
}
