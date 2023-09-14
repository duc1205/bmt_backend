import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { PhoneNumberModel } from 'src/modules/phone-number/domain/models/phone-number-model';
import { IsPhoneNumberWithCountryCode } from 'src/core/rules/is-phone-number-with-country-code';
import { PaginationParamsDto } from 'src/core/dtos/pagination-params-dto';
import { SortParamsDto } from 'src/core/dtos/sort-params-dto';

export class UserDto {
  @ApiProperty()
  password!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Transform((value: any) => value.obj.name.trimStart().trimEnd())
  name!: string;

  @ApiProperty({ type: 'string' })
  @IsPhoneNumberWithCountryCode()
  @Transform((value: any) => {
    return value.obj?.phone_number ? PhoneNumberModel.parsedPhoneNumber(value.obj.phone_number) : undefined;
  })
  @IsNotEmpty()
  phone_number!: PhoneNumberModel;

  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  avatar_path: string | null | undefined;
}

export class CreateUserDto extends UserDto {}

export class ChangePasswordUserDto {
  @ApiProperty()
  @IsString()
  old_password!: string;

  @ApiProperty()
  @IsString()
  new_password!: string;
}

export class ResetPasswordUserDto {
  @ApiProperty()
  @IsString()
  new_password!: string;
}

export class UserParamsDto {
  @ApiProperty()
  @IsString()
  id!: string;
}

export class UpdateUserByMeDto extends PartialType(PickType(UserDto, ['avatar_path', 'name'] as const)) {}

export class GetUserListQueryDto extends PartialType(IntersectionType(PaginationParamsDto, SortParamsDto)) {}
