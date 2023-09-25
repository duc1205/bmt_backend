import EventEntity from './entities/event-entity';
import { EventModel } from '../../domain/model/event-model';
import { EventStatus } from '../../enum/event-status-enum';
import { Brackets, FindOptionsWhere, Repository } from 'typeorm';
import { GroupModel } from 'src/modules/group/domain/models/group-model';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageList } from 'src/core/models/page-list';
import { PaginationParams } from 'src/core/models/pagination-params';
import { SortParams } from 'src/core/models/sort-params';
import { CheckEventAvailableCreate, GetEvent, UpdateEvent } from '../../domain/types/event-body-type';
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
    entity.current_count = event.currentCount;
    entity.max_count = event.maxCount;
    entity.scope = event.scope;
    entity.start_time = event.startTime;
    entity.finish_time = event.finishTime;
    entity.created_at = event.createdAt;
    entity.updated_at = event.updatedAt;

    await this.eventRepository.insert(entity);
  }

  async update(event: EventModel, body: UpdateEvent): Promise<void> {
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

    const query = this.eventRepository.createQueryBuilder().setFindOptions({
      where: condition,
      order: orderBy,
      skip: (paginationParams.page - 1) * paginationParams.limit,
      take: paginationParams.limit,
      relations: relations,
    });

    if (user) {
      query.andWhere(
        'EventEntity.scope = :scope OR EXISTS(SELECT EventEntity.id from event_groups,group_members WHERE event_groups.event_id = EventEntity.id AND event_groups.group_id = group_members.group_id AND group_members.member_id = :member_id LIMIT 1)',
        {
          scope: EventScope.Public,
          member_id: user.id,
        },
      );
    }

    if (group) {
      query.andWhere(
        'EXISTS(SELECT id from event_groups WHERE event_groups.event_id = EventEntity.id AND event_groups.group_id = :group_id LIMIT 1)',
        {
          group_id: group.id,
        },
      );
    }

    if (scope) {
      condition.scope = scope;
    }

    if (status) {
      switch (status) {
        case EventStatus.isComing:
          query.andWhere('start_time > :now', {
            now: new Date(),
          });
          break;

        case EventStatus.isHappening:
          query.andWhere('start_time < :now AND finish_time > :now', {
            now: new Date(),
          });
          break;

        case EventStatus.isFinished:
          query.andWhere('finish_time < :now', {
            now: new Date(),
          });
          break;
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

  async checkAvailableTime(group: GroupModel, body: CheckEventAvailableCreate): Promise<boolean> {
    return !(await this.eventRepository
      .createQueryBuilder()
      .from('event_groups', 'event_groups')
      .where('event_groups.group_id = :group_id', { group_id: group.id })
      .andWhere('finish_time > :date_now', { date_now: new Date() })
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            'start_time BETWEEN :start_time AND :finish_time AND finish_time BETWEEN :start_time AND :finish_time',
            {
              start_time: body.startTime,
              finish_time: body.finishTime,
            },
          ).orWhere('start_time < :start_time AND finish_time > :finish_time', {
            start_time: body.startTime,
            finish_time: body.finishTime,
          });
        }),
      )
      .getExists());
  }

  async get(body: GetEvent, relations: string[] | undefined): Promise<EventModel | undefined> {
    return (await this.eventRepository.findOne({ where: { id: body.id }, relations: relations }))?.toModel();
  }
}
