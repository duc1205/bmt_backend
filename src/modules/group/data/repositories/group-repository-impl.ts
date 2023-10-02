import { Injectable } from '@nestjs/common';
import { GroupRepository } from '../../domain/repositories/group-repository';
import { PageList } from 'src/core/models/page-list';
import { PaginationParams } from 'src/core/models/pagination-params';
import { SortParams } from 'src/core/models/sort-params';
import { UserModel } from 'src/modules/user/domain/models/user-model';
import { GetGroupInput, UpdateGroupInput } from '../../domain/inputs/group-input';
import { GroupModel } from '../../domain/models/group-model';
import { GroupDatasource } from '../datasources/group-datasource';

@Injectable()
export class GroupRepositoryImpl extends GroupRepository {
  constructor(private readonly groupDatasource: GroupDatasource) {
    super();
  }

  async create(group: GroupModel): Promise<void> {
    await this.groupDatasource.create(group);
  }

  async list(
    paginationParams: PaginationParams,
    sortParams: SortParams,
    user: UserModel | undefined,
    relations: string[] | undefined,
  ): Promise<PageList<GroupModel>> {
    return await this.groupDatasource.list(paginationParams, sortParams, user, relations);
  }

  async get(body: GetGroupInput): Promise<GroupModel | undefined> {
    return await this.groupDatasource.get(body);
  }

  async update(group: GroupModel, body: UpdateGroupInput): Promise<void> {
    return await this.groupDatasource.update(group, body);
  }

  async delete(group: GroupModel): Promise<void> {
    return await this.groupDatasource.delete(group);
  }

  async changeOwner(group: GroupModel, owner: UserModel): Promise<void> {
    await this.groupDatasource.changeOwner(group, owner);
  }
}
