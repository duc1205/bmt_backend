import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import EventMemberEntity from './data/datasources/entities/event-member-entity';
import EventEntity from './data/datasources/entities/event-entity';
import { UserModule } from '../user/user-module';
import { GroupModule } from '../group/group-module';
import { EventController } from './app/http/controllers/api/user/v1/event-controller';
import { EventRepository } from './domain/repositories/event-repository';
import { EventRepositoryImpl } from './data/repositories/event-repository-impl';
import { EventDatasource } from './data/datasources/event-datasource';
import { CheckEventAvailableCreateUsecase } from './domain/usecases/event/check-event-available-create-usecase';
import { CreateEventUsecase } from './domain/usecases/event/create-event-usecase';
import { GetEventUsecase } from './domain/usecases/event/get-event-usecase';
import { GetEventsUsecase } from './domain/usecases/event/get-events-usecase';
import { UpdateEventUsecase } from './domain/usecases/event/update-event-usecase';
import { EventMemberDatasource } from './data/datasources/event-member-datasource';
import { EventMemberRepository } from './domain/repositories/event-member-repository';
import { EventMemberRepositoryImpl } from './data/repositories/event-member-repository-impl';
import { CheckEventMemberExistUsecase } from './domain/usecases/event-member/check-event-member-exists-usecase';
import { CheckMemberCanJoinEventUsecase } from './domain/usecases/event-member/check-member-can-join-event-usecase';
import { CreateEventMemberUsecase } from './domain/usecases/event-member/create-event-member-usecase';
import { DeleteEventMembersInGroupUsecase } from './domain/usecases/event-member/delete-event-members-in-group-usecase';
import { DeleteEventMemberUsecase } from './domain/usecases/event-member/delete-event-member-usecase';
import { DeleteAllEventsInGroupUsecase } from './domain/usecases/event/delete-all-events-in-group-usecase';
import { GetEventMembersUsecase } from './domain/usecases/event-member/get-event-members-usecase';
import { DeleteEventUsecase } from './domain/usecases/event/delete-event-usecase';
import { DeleteEventMembersByEventUsecase } from './domain/usecases/event-member/delete-event-members-by-event-usecase';
import { CheckUserJoinEventsUsecase } from './domain/usecases/event-member/check-user-join-events-usecase';

@Module({
  imports: [
    TypeOrmModule.forFeature([EventEntity, EventMemberEntity]),
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
    GetEventsUsecase,
    UpdateEventUsecase,
    DeleteAllEventsInGroupUsecase,
    {
      provide: EventMemberRepository,
      useClass: EventMemberRepositoryImpl,
    },
    EventMemberDatasource,
    CheckEventMemberExistUsecase,
    CheckMemberCanJoinEventUsecase,
    CreateEventMemberUsecase,
    DeleteEventMembersInGroupUsecase,
    DeleteEventMemberUsecase,
    GetEventMembersUsecase,
    DeleteEventUsecase,
    DeleteEventMembersByEventUsecase,
    CheckUserJoinEventsUsecase,
  ],
  exports: [GetEventsUsecase, DeleteEventMembersInGroupUsecase, DeleteAllEventsInGroupUsecase],
})
export class EventModule {}
