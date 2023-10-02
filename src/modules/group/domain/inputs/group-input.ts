export type GroupInput = {
  id: string;
  name: string;
  avatarPath?: string | undefined | null;
};

export type CreateGroupInput = Pick<GroupInput, 'name' | 'avatarPath'>;

export type UpdateGroupInput = Partial<Pick<GroupInput, 'name' | 'avatarPath'>>;

export type GetGroupInput = Partial<Pick<GroupInput, 'id'>>;
