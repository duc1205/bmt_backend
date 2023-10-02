import { Injectable } from '@nestjs/common';
import { EventMemberRepository } from '../../domain/repositories/event-member-repository';
import { UserModel } from 'src/modules/user/domain/models/user-model';
import { EventMemberModel } from '../../domain/model/event-member-model';
import { EventModel } from '../../domain/model/event-model';
import { EventMemberDatasource } from '../datasources/event-member-datasource';
import { EventStatus } from '../../enum/event-status-enum';
import { GroupModel } from 'src/modules/group/domain/models/group-model';
import { PageList } from 'src/core/models/page-list';
import { PaginationParams } from 'src/core/models/pagination-params';
import { SortParams } from 'src/core/models/sort-params';

@Injectable()
export class EventMemberRepositoryImpl extends EventMemberRepository {
  constructor(private readonly eventMemberDatasource: EventMemberDatasource) {
    super();
  }
  async create(eventMember: EventMemberModel): Promise<void> {
    await this.eventMemberDatasource.create(eventMember);
  }

  async checkExist(event: EventModel, member: UserModel): Promise<boolean> {
    return await this.eventMemberDatasource.checkExist(event, member);
  }

  async checkMemberJoinAvailableTime(member: UserModel, event: EventModel): Promise<boolean> {
    return await this.eventMemberDatasource.checkMemberJoinAvailableTime(member, event);
  }

  async get(
    event: EventModel,
    member: UserModel,
    relations: string[] | undefined,
  ): Promise<EventMemberModel | undefined> {
    return await this.eventMemberDatasource.get(event, member, relations);
  }

  async delete(eventMember: EventMemberModel): Promise<void> {
    await this.eventMemberDatasource.delete(eventMember);
  }

  async deleteInGroup(
    group: GroupModel,
    member: UserModel | undefined,
    status: EventStatus | undefined,
  ): Promise<void> {
    await this.eventMemberDatasource.deleteInGroup(group, member, status);
  }

  async list(
    paginationParams: PaginationParams,
    sortParams: SortParams,
    event: EventModel,
    relations: string[] | undefined,
  ): Promise<PageList<EventMemberModel>> {
    return await this.eventMemberDatasource.list(paginationParams, sortParams, event, relations);
  }

  async deleteAllByEvent(event: EventModel): Promise<void> {
    await this.eventMemberDatasource.deleteAllByEvent(event);
  }
}
