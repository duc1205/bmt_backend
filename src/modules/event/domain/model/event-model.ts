import { ApiProperty } from '@nestjs/swagger';
import { DomainModel } from 'src/core/models/domain-model';
import { EventScope } from '../../enum/event-scope-enum';
import { EventStatus } from '../../enum/event-status-enum';

export class EventModel extends DomainModel {
  @ApiProperty()
  public readonly id: string;

  @ApiProperty()
  public readonly title: string;

  @ApiProperty()
  public readonly description: string;

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

  constructor(
    id: string,
    title: string,
    description: string,
    currentCount: number,
    maxCount: number,
    startTime: Date,
    finishTime: Date,
    scope: EventScope,
    createdAt: Date,
    updatedAt: Date,
  ) {
    super();
    this.id = id;
    this.title = title;
    this.description = description;
    this.currentCount = currentCount;
    this.maxCount = maxCount;
    this.startTime = startTime;
    this.finishTime = finishTime;
    this.scope = scope;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  toJson(): Record<string, any> {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      current_count: this.currentCount,
      max_count: this.maxCount,
      start_time: this.startTime,
      finish_time: this.finishTime,
      scope: this.scope,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
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
