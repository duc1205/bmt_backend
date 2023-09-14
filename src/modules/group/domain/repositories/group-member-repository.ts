import { PaginationParams } from 'src/core/models/pagination-params';
import { SortParams } from 'src/core/models/sort-params';
import { PageList } from 'src/core/models/page-list';
import { GroupModel } from '../models/group-model';
import { UserModel } from 'src/modules/user/domain/models/user-model';
import { GetGroupMemberBody, RemoveAllGroupMemberInterface } from '../interfaces/group-member-interface';
import { GroupMemberModel } from '../models/group-member-model';

export abstract class GroupMemberRepository {
  abstract list(
    paginationParams: PaginationParams,
    sortParams: SortParams,
    group: GroupModel,
    relations: string[] | undefined,
  ): Promise<PageList<GroupMemberModel>>;

  abstract get(body: GetGroupMemberBody): Promise<GroupMemberModel | undefined>;

  abstract checkExist(group: GroupModel, user: UserModel): Promise<boolean>;

  abstract add(groupMember: GroupMemberModel): Promise<void>;

  abstract remove(group: GroupModel, member: UserModel): Promise<void>;

  abstract removeAll(body: RemoveAllGroupMemberInterface): Promise<void>;

  abstract count(group: GroupModel): Promise<number>;
}
