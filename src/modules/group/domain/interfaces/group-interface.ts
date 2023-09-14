export type GroupInterface = {
  id: string;
  name: string;
  avatarPath?: string | undefined | null;
};

export type CreateGroupInterface = Pick<GroupInterface, 'name' | 'avatarPath'>;

export type UpdateGroupInterface = Partial<Pick<GroupInterface, 'name' | 'avatarPath'>>;

export type GetGroupBody = Partial<Pick<GroupInterface, 'id'>>;
