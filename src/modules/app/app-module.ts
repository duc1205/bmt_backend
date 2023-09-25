import app from 'src/config/app';
import database from 'src/config/database';
import swagger from 'src/config/swagger';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { AppController } from './app-controller';
import { AppService } from './app-service';
import { AuthModule } from '../auth/auth-module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { GroupModule } from '../group/group-module';
import { Module } from '@nestjs/common';
import { throwError } from 'src/core/helpers/utils';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserModule } from '../user/user-module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth-guard';
import { EventModule } from '../event/event-module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [app, database, swagger],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get<TypeOrmModuleOptions>('database') as TypeOrmModuleOptions,
      async dataSourceFactory(options) {
        return addTransactionalDataSource(new DataSource(options ?? throwError()));
      },
    }),
    UserModule,
    AuthModule,
    GroupModule,
    EventModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
