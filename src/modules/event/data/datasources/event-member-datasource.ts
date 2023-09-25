import EventMemberEntity from './entities/event-member-entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { EventMemberModel } from '../../domain/model/event-member-model';
import { EventModel } from '../../domain/model/event-model';
import { UserModel } from 'src/modules/user/domain/models/user-model';

@Injectable()
export class EventMemberDatasource {
  constructor(
    @InjectRepository(EventMemberEntity)
    private readonly eventMemberRepository: Repository<EventMemberEntity>,
  ) {}

  async create(eventMember: EventMemberModel): Promise<void> {
    const entity = new EventMemberEntity();
    entity.id = eventMember.id;
    entity.member_id = eventMember.memberId;
    entity.event_id = eventMember.eventId;
    entity.created_at = eventMember.createdAt;
    entity.updated_at = eventMember.updatedAt;

    await this.eventMemberRepository.insert(entity);
  }

  async checkExist(event: EventModel, member: UserModel): Promise<boolean> {
    return (await this.eventMemberRepository.count({ where: { event_id: event.id, member_id: member.id } })) > 0;
  }

  async checkMemberJoinAvailableTime(member: UserModel, event: EventModel): Promise<boolean> {
    return !(await this.eventMemberRepository
      .createQueryBuilder()
      .from('events', 'events')
      .where('member_id = :member_id ', { member_id: member.id })
      .andWhere('events.id <> :event_id ', { event_id: event.id })
      .andWhere('events.start_time < :date_now', { date_now: new Date() })
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            '(events.start_time BETWEEN :start_time AND :finish_time AND events.finish_time BETWEEN :start_time AND :finish_time)',
            {
              start_time: event.startTime,
              finish_time: event.finishTime,
            },
          ).orWhere('events.start_time < :start_time AND events.finish_time > :finish_time', {
            start_time: event.startTime,
            finish_time: event.finishTime,
          });
        }),
      )
      .getExists());
  }
}
