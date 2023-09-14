import { Injectable } from '@nestjs/common';
import { GroupMemberRepository } from '../../domain/repositories/group-member-repository';
import { PageList } from 'src/core/models/page-list';
import { PaginationParams } from 'src/core/models/pagination-params';
import { SortParams } from 'src/core/models/sort-params';
import { UserModel } from 'src/modules/user/domain/models/user-model';
import { GetGroupMemberBody, RemoveAllGroupMemberInterface } from '../../domain/interfaces/group-member-interface';
import { GroupMemberModel } from '../../domain/models/group-member-model';
import { GroupModel } from '../../domain/models/group-model';
import { GroupMemberDatasource } from '../datasources/group-member-datasource';

@Injectable()
export class GroupMemberRepositoryImpl extends GroupMemberRepository {
  constructor(private readonly groupMemberDatasource: GroupMemberDatasource) {
    super();
  }

  async list(
    paginationParams: PaginationParams,
    sortParams: SortParams,
    group: GroupModel,
    relations: string[] | undefined,
  ): Promise<PageList<GroupMemberModel>> {
    return await this.groupMemberDatasource.list(paginationParams, sortParams, group, relations);
  }

  async get(body: GetGroupMemberBody): Promise<GroupMemberModel | undefined> {
    return await this.groupMemberDatasource.get(body);
  }

  async checkExist(group: GroupModel, user: UserModel): Promise<boolean> {
    return await this.groupMemberDatasource.checkExist(group, user);
  }

  async add(groupMember: GroupMemberModel): Promise<void> {
    await this.groupMemberDatasource.create(groupMember);
  }

  async remove(group: GroupModel, member: UserModel): Promise<void> {
    await this.groupMemberDatasource.remove(group, member);
  }

  async removeAll(body: RemoveAllGroupMemberInterface): Promise<void> {
    await this.groupMemberDatasource.removeAll(body);
  }

  async count(group: GroupModel): Promise<number> {
    return await this.groupMemberDatasource.count(group);
  }
}
