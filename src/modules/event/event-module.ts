import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import EventMemberEntity from './data/datasources/entities/event-member-entity';
import EventEntity from './data/datasources/entities/event-entity';
import EventGroupEntity from './data/datasources/entities/event-group-entity';
import { UserModule } from '../user/user-module';
import { GroupModule } from '../group/group-module';
import { EventController } from './app/http/controllers/api/user/v1/event-controller';
import { EventRepository } from './domain/repositories/event-repository';
import { EventRepositoryImpl } from './data/repositories/event-repository-impl';
import { EventDatasource } from './data/datasources/event-datasource';
import { CheckEventAvailableCreateUsecase } from './domain/usecases/event/check-event-available-create-usecase';
import { CreateEventUsecase } from './domain/usecases/event/create-event-usecase';
import { GetEventUsecase } from './domain/usecases/event/get-event-usecase';
import { GetListEventUsecase } from './domain/usecases/event/get-list-event-usecase';
import { UpdateEventUsecase } from './domain/usecases/event/update-event-usecase';
import { EventGroupRepository } from './domain/repositories/event-group-repository';
import { EventGroupRepositoryImpl } from './data/repositories/event-group-repository-impl';
import { EventMemberDatasource } from './data/datasources/event-member-datasource';
import { CheckEventGroupExistUsecase } from './domain/usecases/event-group/check-event-group-exists-usecase';
import { CreateEventGroupUsecase } from './domain/usecases/event-group/create-event-group-usecase';
import { GetEventGroupUsecase } from './domain/usecases/event-group/get-event-group-usecase';
import { EventMemberRepository } from './domain/repositories/event-member-repository';
import { EventMemberRepositoryImpl } from './data/repositories/event-member-repository-impl';
import { CheckEventMemberExistUsecase } from './domain/usecases/event-member/check-event-member-exists-usecase';
import { CheckMemberCanJoinEventUsecase } from './domain/usecases/event-member/check-member-can-join-event-usecase';
import { CreateEventMemberUsecase } from './domain/usecases/event-member/create-event-member-usecase';
import { EventGroupDatasource } from './data/datasources/event-group-datasource';

@Module({
  imports: [
    TypeOrmModule.forFeature([EventEntity, EventMemberEntity, EventGroupEntity]),
    forwardRef(() => UserModule),
    forwardRef(() => GroupModule),
  ],
  controllers: [EventController],
  providers: [
    {
      provide: EventRepository,
      useClass: EventRepositoryImpl,
    },
    EventDatasource,
    CheckEventAvailableCreateUsecase,
    CreateEventUsecase,
    GetEventUsecase,
    GetListEventUsecase,
    UpdateEventUsecase,
    {
      provide: EventGroupRepository,
      useClass: EventGroupRepositoryImpl,
    },
    EventGroupDatasource,
    CheckEventGroupExistUsecase,
    CreateEventGroupUsecase,
    GetEventGroupUsecase,
    {
      provide: EventMemberRepository,
      useClass: EventMemberRepositoryImpl,
    },
    EventMemberDatasource,
    CheckEventMemberExistUsecase,
    CheckMemberCanJoinEventUsecase,
    CreateEventMemberUsecase,
  ],
  exports: [],
})
export class EventModule {}
