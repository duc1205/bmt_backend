import { Injectable } from '@nestjs/common';
import { EventMemberRepository } from '../../domain/repositories/event-member-repository';
import { UserModel } from 'src/modules/user/domain/models/user-model';
import { EventMemberModel } from '../../domain/model/event-member-model';
import { EventModel } from '../../domain/model/event-model';
import { EventMemberDatasource } from '../datasources/event-member-datasource';

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
}
