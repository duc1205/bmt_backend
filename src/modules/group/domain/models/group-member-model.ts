import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DomainModel } from 'src/core/models/domain-model';
import { UserModel } from 'src/modules/user/domain/models/user-model';
import { GroupModel } from './group-model';

export class GroupMemberModel extends DomainModel {
  @ApiProperty()
  public readonly id: string;

  @ApiProperty({ name: 'group_id' })
  public readonly groupId: string;

  @ApiProperty({ name: 'member_id' })
  public readonly memberId: string;

  @ApiProperty({ name: 'created_at' })
  public readonly createdAt: Date;

  @ApiProperty({ name: 'updated_at' })
  public readonly updatedAt: Date;

  @ApiPropertyOptional({ name: 'member' })
  public readonly member: UserModel | undefined;

  @ApiPropertyOptional({ name: 'group' })
  public readonly group: GroupModel | undefined;

  constructor(
    id: string,
    groupId: string,
    memberId: string,
    createdAt: Date,
    updatedAt: Date,
    member: UserModel | undefined,
    group: GroupModel | undefined,
  ) {
    super();
    this.id = id;
    this.groupId = groupId;
    this.memberId = memberId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.member = member;
    this.group = group;
  }

  toJson(): Record<string, any> {
    return {
      id: this.id,
      member_id: this.memberId,
      group_id: this.groupId,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
      member: this.member?.toJson(),
      group: this.group?.toJson(),
    };
  }
}
