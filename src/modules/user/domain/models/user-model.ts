import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DomainModel } from 'src/core/models/domain-model';

export class UserModel extends DomainModel {
  @ApiProperty()
  public readonly id: string;

  @ApiProperty()
  public readonly password: string;

  @ApiPropertyOptional()
  public readonly name: string;

  @ApiPropertyOptional({ name: 'phone_number' })
  public readonly phoneNumber: string;

  @ApiPropertyOptional({ name: 'avatar_path', type: 'string' })
  public readonly avatarPath: string | undefined | null;

  @ApiPropertyOptional({ name: 'avatar_url', type: 'string' })
  public readonly avatarUrl: string | null;

  @ApiProperty({ name: 'created_at' })
  public readonly createdAt: Date;

  @ApiProperty({ name: 'updated_at' })
  public readonly updatedAt: Date;

  constructor(
    id: string,
    password: string,
    name: string,
    phoneNumber: string,
    avatarPath: string | undefined | null,
    createdAt: Date,
    updatedAt: Date,
  ) {
    super();
    this.id = id;
    this.password = password;
    this.name = name;
    this.phoneNumber = phoneNumber;
    this.avatarPath = avatarPath;
    this.avatarUrl = this.avatarPath ? process.env.STORAGE_PUBLIC_URL + '/' + this.avatarPath : null;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  toJson(): Record<string, any> {
    return {
      id: this.id,
      name: this.name,
      phone_number: this.phoneNumber,
      avatar_url: this.avatarUrl,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };
  }
}
