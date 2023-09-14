import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { PaginationParamsDto } from 'src/core/dtos/pagination-params-dto';
import { SortParamsDto } from 'src/core/dtos/sort-params-dto';

export class GroupDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Transform((value: any) => value.obj.name.trimStart().trimEnd())
  name!: string;

  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  avatar_path: string | null | undefined;
}

export class CreateGroupDto extends GroupDto {}

export class UpdateGroupDto extends PartialType(PickType(GroupDto, ['avatar_path', 'name'] as const)) {}

export class GetGroupListQueryDto extends PartialType(IntersectionType(PaginationParamsDto, SortParamsDto)) {}

export class GroupParamsDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Transform((value: any) => value.obj.name.trimStart().trimEnd())
  id!: string;
}
