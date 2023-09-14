import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, Min } from 'class-validator';
import { parseBoolean } from '../helpers/utils';

export class PaginationParamsDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number | undefined;

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @IsInt()
  limit: number | undefined;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @Transform((value: any) => parseBoolean(value.obj?.need_total_count, false))
  @IsBoolean()
  need_total_count: boolean | undefined;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @Transform((value: any) => parseBoolean(value.obj?.only_count, false))
  @IsBoolean()
  only_count: boolean | undefined;
}
