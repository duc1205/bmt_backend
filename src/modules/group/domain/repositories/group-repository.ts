import { PaginationParams } from 'src/core/models/pagination-params';
import { SortParams } from 'src/core/models/sort-params';
import { PageList } from 'src/core/models/page-list';
import { GroupModel } from '../models/group-model';
import { GetGroupInput, UpdateGroupInput } from '../inputs/group-input';
import { UserModel } from 'src/modules/user/domain/models/user-model';

export abstract class GroupRepository {
  abstract list(
    paginationParams: PaginationParams,
    sortParams: SortParams,
    user: UserModel | undefined,
    relations: string[] | undefined,
  ): Promise<PageList<GroupModel>>;

  abstract get(body: GetGroupInput): Promise<GroupModel | undefined>;

  abstract create(group: GroupModel): Promise<void>;

  abstract update(group: GroupModel, body: UpdateGroupInput): Promise<void>;

  abstract delete(group: GroupModel): Promise<void>;

  abstract changeOwner(group: GroupModel, newOwner: UserModel): Promise<void>;
}
