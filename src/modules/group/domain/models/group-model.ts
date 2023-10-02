import { ApiHideProperty, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DomainModel } from 'src/core/models/domain-model';
import { UserModel } from 'src/modules/user/domain/models/user-model';

export class GroupModel extends DomainModel {
  @ApiProperty()
  public readonly id: string;

  @ApiProperty()
  public readonly name: string;

  @ApiProperty()
  public readonly ownerId: string;

  @ApiHideProperty()
  public readonly avatarPath: string | undefined | null;

  @ApiPropertyOptional({ name: 'avatar_url', type: 'string' })
  public readonly avatarUrl: string | null;

  @ApiProperty({ name: 'created_at' })
  public readonly createdAt: Date;

  @ApiProperty({ name: 'updated_at' })
  public readonly updatedAt: Date;

  @ApiPropertyOptional({ name: 'owner' })
  public readonly owner: UserModel | undefined;

  constructor(
    id: string,
    name: string,
    ownerId: string,
    avatarPath: string | undefined | null,
    createdAt: Date,
    updatedAt: Date,
    owner: UserModel | undefined,
  ) {
    super();
    this.id = id;
    this.name = name;
    this.ownerId = ownerId;
    this.avatarPath = avatarPath;
    this.avatarUrl = this.avatarPath ? process.env.STORAGE_PUBLIC_URL + '/' + this.avatarPath : null;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.owner = owner;
  }

  toJson(): Record<string, any> {
    return {
      id: this.id,
      name: this.name,
      avatar_url: this.avatarUrl,
      owner_id: this.ownerId,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
      owner: this.owner?.toJson(),
    };
  }
}
