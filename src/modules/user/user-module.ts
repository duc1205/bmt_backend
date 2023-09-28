import UserEntity from './data/datasources/entities/user-entity';
import { ChangeUserPasswordUsecase } from './domain/usecases/change-user-password-usecase';
import { CheckUserPasswordUsecase } from './domain/usecases/check-user-password-usecase';
import { CheckUserPhoneNumberExistsUsecase } from './domain/usecases/check-user-phone-number-exists-usecase';
import { CreateUserUsecase } from './domain/usecases/create-user-usecase';
import { GetUsersUsecase } from './domain/usecases/get-users-usecase';
import { GetUserUsecase } from './domain/usecases/get-user-usecase';
import { MeController } from './app/http/controllers/api/user/v1/me-controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UpdateUserUsecase } from './domain/usecases/update-user-usecase';
import { UserController as PublicController } from './app/http/controllers/api/public/v1/user-controller';
import { UserController as UserControllerByUser } from './app/http/controllers/api/user/v1/user-controller';
import { UserDatasource } from './data/datasources/user-datasource';
import { UserRepository } from './domain/repositories/user-repository';
import { UserRepositoryImpl } from './data/repositories/user-repository-impl';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [MeController, PublicController, UserControllerByUser],
  providers: [
    {
      provide: UserRepository,
      useClass: UserRepositoryImpl,
    },
    GetUserUsecase,
    GetUsersUsecase,
    CreateUserUsecase,
    UpdateUserUsecase,
    ChangeUserPasswordUsecase,
    CheckUserPasswordUsecase,
    CheckUserPhoneNumberExistsUsecase,
    UserDatasource,
  ],
  exports: [GetUserUsecase, CheckUserPasswordUsecase],
})
export class UserModule {}
