import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { PaginationParamsDto } from 'src/core/dtos/pagination-params-dto';
import { SortParamsDto } from 'src/core/dtos/sort-params-dto';

export class GroupMemberDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Transform((value: any) => value.obj.group_id.trimStart().trimEnd())
  group_id!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Transform((value: any) => value.obj.member_id.trimStart().trimEnd())
  member_id!: string;
}

export class AddGroupMemberDto extends GroupMemberDto {}

export class RemoveGroupMemberDto extends GroupMemberDto {}

export class GetGroupMemberListQueryDto extends PartialType(IntersectionType(PaginationParamsDto, SortParamsDto)) {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Transform((value: any) => value.obj.group_id.trimStart().trimEnd())
  group_id!: string;
}

export class GetGroupListQueryDto extends PartialType(IntersectionType(PaginationParamsDto, SortParamsDto)) {}

export class GroupMemberParamsDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Transform((value: any) => value.obj.group_id.trimStart().trimEnd())
  group_id!: string;
}
