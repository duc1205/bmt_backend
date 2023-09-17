import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { AuthProvider } from '../../domain/providers/auth-provider';

export class AuthDto {
  @ApiProperty()
  @IsString()
  client_id!: string;

  @ApiProperty()
  @IsString()
  client_secret!: string;

  @ApiProperty({ type: 'string' })
  @IsString()
  @IsNotEmpty()
  username!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password!: string;
}

export class LoginAuthDto extends PickType(AuthDto, ['client_id', 'client_secret', 'username', 'password']) {}

export class CreateAuthClientCommandParamsDto {
  @ApiProperty()
  @IsEnum(AuthProvider)
  provider!: AuthProvider;
}
