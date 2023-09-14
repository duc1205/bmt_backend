import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { SortDir } from 'src/core/enums/sort-dir';

export class SortParamsDto {
  @ApiPropertyOptional({ default: 'id' })
  @IsString()
  @IsOptional()
  sort: string | undefined;

  @ApiPropertyOptional({ enum: SortDir, default: 'ASC' })
  @Transform((value: any) => value.obj?.dir?.toUpperCase())
  @IsEnum(SortDir)
  @IsOptional()
  dir: SortDir | undefined;
}
