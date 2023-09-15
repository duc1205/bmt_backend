import { UserModel } from 'src/modules/user/domain/models/user-model';
import { GroupModel } from '../models/group-model';

export type GroupMemberInterface = {
  id: string;
  group?: GroupModel;
  member?: UserModel;
};

export type GetGroupMemberBody = Partial<Pick<GroupMemberInterface, 'id' | 'group' | 'member'>>;

export type RemoveAllGroupMemberInterface = {
  group?: GroupModel;
};
