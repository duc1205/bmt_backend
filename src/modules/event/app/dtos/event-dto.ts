import {
  IsArray,
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  ValidateIf,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { PaginationParamsDto } from 'src/core/dtos/pagination-params-dto';
import { SortParamsDto } from 'src/core/dtos/sort-params-dto';
import { EventScope } from '../../enum/event-scope-enum';
import { EventStatus } from '../../enum/event-status-enum';

export class EventDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty()
  @IsString()
  description!: string;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  max_count!: number;

  @ApiProperty()
  @IsDate()
  @Transform((value) => new Date(value.obj.start_time))
  start_time!: Date;

  @ApiProperty()
  @IsDate()
  @Transform((value) => new Date(value.obj.finish_time))
  finish_time!: Date;

  @ApiProperty()
  @IsEnum(EventScope)
  scope!: EventScope;

  @ApiProperty()
  @IsNotEmpty()
  @ValidateIf((obj) => obj.scope == EventScope.Group)
  @IsString()
  group_id: string | undefined;
}

export class CreateEventDto extends EventDto {}

export class UpdateEventDto extends PartialType(PickType(EventDto, ['title', 'description'] as const)) {}

export class GetEventListQueryDto extends PartialType(IntersectionType(PaginationParamsDto, SortParamsDto)) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(EventScope)
  scope: EventScope | undefined;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  group_id: string | undefined;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(EventStatus)
  status: EventStatus | undefined;
}

export class EventParamsDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Transform((value: any) => value.obj.id.trimStart().trimEnd())
  id!: string;
}

export class GetEventMemberListQueryDto extends PartialType(IntersectionType(PaginationParamsDto, SortParamsDto)) {
  @ApiProperty()
  @IsString()
  event_id!: string;
}

export class CheckUserJoinedEventsDto {
  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  event_ids!: string[];
}
