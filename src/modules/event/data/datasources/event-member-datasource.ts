import EventMemberEntity from './entities/event-member-entity';
import { Brackets, FindOptionsWhere, In, Repository } from 'typeorm';
import { EventMemberModel } from '../../domain/model/event-member-model';
import { EventModel } from '../../domain/model/event-model';
import { EventStatus } from '../../enum/event-status-enum';
import { GroupModel } from 'src/modules/group/domain/models/group-model';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from 'src/modules/user/domain/models/user-model';
import EventEntity from './entities/event-entity';
import { PaginationParams } from 'src/core/models/pagination-params';
import { SortParams } from 'src/core/models/sort-params';
import { PageList } from 'src/core/models/page-list';

@Injectable()
export class EventMemberDatasource {
  constructor(
    @InjectRepository(EventMemberEntity)
    private readonly eventMemberRepository: Repository<EventMemberEntity>,

    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>,
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
            '(events.start_time BETWEEN :start_time AND :finish_time OR events.finish_time BETWEEN :start_time AND :finish_time)',
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

  async get(
    event: EventModel,
    member: UserModel,
    relations: string[] | undefined,
  ): Promise<EventMemberModel | undefined> {
    return (
      await this.eventMemberRepository.findOne({
        where: { event_id: event.id, member_id: member.id },
        relations: relations,
      })
    )?.toModel();
  }

  async delete(eventMember: EventMemberModel): Promise<void> {
    await this.eventMemberRepository.delete({ id: eventMember.id });
  }

  async deleteInGroup(
    group: GroupModel,
    member: UserModel | undefined,
    status: EventStatus | undefined,
  ): Promise<void> {
    const condition: FindOptionsWhere<EventMemberEntity> = {};

    const query = this.eventMemberRepository
      .createQueryBuilder('event_members')
      .where(
        'EXISTS(SELECT id FROM events WHERE events.group_id = :group_id AND event_members.event_id = events.id LIMIT 1)',
        {
          group_id: group.id,
        },
      );

    if (member) {
      condition.member_id = member.id;
    }
    query.andWhere(condition);

    if (status) {
      switch (status) {
        case EventStatus.isComing:
          query.andWhere(
            'EXISTS(SELECT events.id FROM events WHERE events.id = event_members.event_id AND events.start_time > :now LIMIT 1)',
            { now: new Date() },
          );
          break;
        case EventStatus.isHappening:
          query.andWhere(
            'EXISTS(SELECT events.id FROM events WHERE events.id = event_members.event_id AND events.start_time < :now AND events.finish_time > :now LIMIT 1)',
            { now: new Date() },
          );
          break;
        case EventStatus.isFinished: {
          query.andWhere(
            'EXISTS(SELECT events.id FROM events WHERE events.id = event_members.event_id AND events.finish_time < :now LIMIT 1)',
            { now: new Date() },
          );
          break;
        }
      }
    }

    const eventMemberList = await query.getMany();
    await this.eventRepository.update(
      { id: In(eventMemberList.map((eventMember) => eventMember.event_id)) },
      { current_count: (): any => (member ? 'current_count - 1' : 0) },
    );

    await query.delete().execute();
  }

  async list(
    paginationParams: PaginationParams,
    sortParams: SortParams,
    event: EventModel,
    relations: string[] | undefined,
  ): Promise<PageList<EventMemberModel>> {
    const condition: FindOptionsWhere<EventMemberEntity> = {};
    const orderBy: Record<any, any> = {};
    orderBy[sortParams.sort] = sortParams.dir;

    condition.event_id = event.id;

    const query = this.eventMemberRepository.createQueryBuilder().setFindOptions({
      where: condition,
      order: orderBy,
      skip: (paginationParams.page - 1) * paginationParams.limit,
      take: paginationParams.limit,
      relations: relations,
    });

    let eventMembers: Array<EventMemberEntity> = [];
    if (!paginationParams.onlyCount) {
      eventMembers = await query.getMany();
    }

    return new PageList(
      paginationParams.page,
      paginationParams.needTotalCount ? await query.getCount() : undefined,
      eventMembers.map((entity) => entity.toModel()),
    );
  }

  async deleteAllByEvent(event: EventModel): Promise<void> {
    await this.eventMemberRepository.delete({ event_id: event.id });
  }

  async checkUserJoinEvents(user: UserModel, eventIds: string[]): Promise<Record<string, boolean>> {
    const foundedIds = [
      ...new Set(
        (
          await this.eventMemberRepository.find({
            where: { event_id: In(eventIds), member_id: user.id },
            select: ['event_id'],
          })
        ).map(function (entity) {
          return entity.event_id;
        }),
      ),
    ];

    const result: Record<string, boolean> = {};
    eventIds.forEach(function (eventId) {
      result[eventId] = foundedIds.includes(eventId);
    });

    return result;
  }
}
