import EventEntity from './entities/event-entity';
import { EventModel } from '../../domain/model/event-model';
import { EventStatus } from '../../enum/event-status-enum';
import { Brackets, FindOptionsWhere, LessThan, MoreThan, Repository } from 'typeorm';
import { GroupModel } from 'src/modules/group/domain/models/group-model';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageList } from 'src/core/models/page-list';
import { PaginationParams } from 'src/core/models/pagination-params';
import { SortParams } from 'src/core/models/sort-params';
import { CheckEventAvailableCreateInput, UpdateEventInput } from '../../domain/inputs/event-input';
import { UserModel } from 'src/modules/user/domain/models/user-model';
import { EventScope } from '../../enum/event-scope-enum';

@Injectable()
export class EventDatasource {
  constructor(
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>,
  ) {}

  async create(event: EventModel): Promise<void> {
    const entity = new EventEntity();
    entity.id = event.id;
    entity.title = event.title;
    entity.description = event.description;
    entity.organizer_id = event.organizerId;
    entity.group_id = event.groupId;
    entity.current_count = event.currentCount;
    entity.max_count = event.maxCount;
    entity.scope = event.scope;
    entity.start_time = event.startTime;
    entity.finish_time = event.finishTime;
    entity.created_at = event.createdAt;
    entity.updated_at = event.updatedAt;

    await this.eventRepository.insert(entity);
  }

  async update(event: EventModel, body: UpdateEventInput): Promise<void> {
    await this.eventRepository.update(event.id, {
      ...(body.title && { title: body.title }),
      ...(body.description && { description: body.description }),
      ...(body.currentCount != undefined && { current_count: body.currentCount }),
      updated_at: new Date(),
    });
  }

  async list(
    paginationParams: PaginationParams,
    sortParams: SortParams,
    user: UserModel | undefined,
    group: GroupModel | undefined,
    status: EventStatus | undefined,
    scope: EventScope | undefined,
    relations: string[] | undefined,
  ): Promise<PageList<EventModel>> {
    const condition: FindOptionsWhere<EventEntity> = {};

    const orderBy: Record<any, any> = {};
    orderBy[sortParams.sort] = sortParams.dir;

    if (group) {
      condition.group_id = group.id;
    }

    if (scope) {
      condition.scope = scope;
    }

    if (status) {
      switch (status) {
        case EventStatus.isComing:
          condition.start_time = MoreThan(new Date());
          break;

        case EventStatus.isHappening:
          condition.start_time = LessThan(new Date());
          condition.finish_time = MoreThan(new Date());
          break;

        case EventStatus.isFinished:
          condition.finish_time = LessThan(new Date());
          break;
      }
    }

    const query = this.eventRepository.createQueryBuilder().setFindOptions({
      where: condition,
      order: orderBy,
      skip: (paginationParams.page - 1) * paginationParams.limit,
      take: paginationParams.limit,
      relations: relations,
    });

    if (user) {
      if (!scope) {
        query.andWhere(
          '(EventEntity.scope = :scope OR EXISTS(SELECT EventEntity.id from group_members WHERE EventEntity.group_id = group_members.group_id AND group_members.member_id = :member_id LIMIT 1))',
          {
            scope: EventScope.Public,
            member_id: user.id,
          },
        );
      }

      if (scope == EventScope.Group) {
        query.andWhere(
          'EXISTS(SELECT EventEntity.id from group_members WHERE EventEntity.group_id = group_members.group_id AND group_members.member_id = :member_id LIMIT 1)',
          {
            member_id: user.id,
          },
        );
      }
    }

    let events: Array<EventEntity> = [];
    if (!paginationParams.onlyCount) {
      events = await query.getMany();
    }

    let totalCount = undefined;
    if (paginationParams.needTotalCount) {
      totalCount = await query.getCount();
    }

    return new PageList(
      paginationParams.page,
      totalCount,
      events.map((entity) => entity.toModel()),
    );
  }

  async checkAvailableTime(
    group: GroupModel | undefined,
    organizer: UserModel,
    body: CheckEventAvailableCreateInput,
  ): Promise<boolean> {
    const query = this.eventRepository.createQueryBuilder().from('event_members', 'event_members');

    query.where(
      new Brackets((qb) => {
        qb.where('event_members.event_id = EventEntity.id AND event_members.member_id = :member_id', {
          member_id: organizer.id,
        });

        if (group) {
          qb.orWhere('group_id = :group_id', { group_id: group.id });
        }
      }),
    );

    query.andWhere(
      new Brackets((qb) => {
        qb.where(
          'start_time BETWEEN :start_time AND :finish_time OR finish_time BETWEEN :start_time AND :finish_time',
          {
            start_time: body.startTime,
            finish_time: body.finishTime,
          },
        ).orWhere('start_time < :start_time AND finish_time > :finish_time', {
          start_time: body.startTime,
          finish_time: body.finishTime,
        });
      }),
    );

    return !(await query.getExists());
  }

  async get(id: string, relations: string[] | undefined): Promise<EventModel | undefined> {
    return (await this.eventRepository.findOne({ where: { id: id }, relations: relations }))?.toModel();
  }

  async deleteAllByGroup(group: GroupModel): Promise<void> {
    await this.eventRepository.delete({ group_id: group.id });
  }

  async delete(event: EventModel): Promise<void> {
    await this.eventRepository.delete(event.id);
  }
}
