import { UserModel } from 'src/modules/user/domain/models/user-model';
import { GroupModel } from '../models/group-model';

export type GroupMemberInput = {
  id: string;
  group?: GroupModel;
  member?: UserModel;
};

export type GetGroupMemberInput = Partial<Pick<GroupMemberInput, 'id' | 'group' | 'member'>>;

export type DeleteAllGroupMemberInput = {
  group?: GroupModel;
};
