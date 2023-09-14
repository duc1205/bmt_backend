import auth from 'src/config/auth';
import { AuthController } from './app/http/controllers/auth-controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CreateAuthClientCommand } from './app/console/commands/create-auth-client-command';
import { CreateAuthPayloadUsecase } from './domain/usecases/auth-payload/create-auth-payload-usecase';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { JwtUserStrategy } from './strategies/jwt-user-strategy';
import { LoginUsecase } from './domain/usecases/login-usecase';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user-module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [auth],
    }),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): any => configService.get<JwtModuleOptions>('auth.jwt'),
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [LoginUsecase, JwtUserStrategy, CreateAuthPayloadUsecase, CreateAuthClientCommand],
})
export class AuthModule {}
