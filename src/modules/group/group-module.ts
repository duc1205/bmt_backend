import GroupEntity from './data/datasources/entities/group-entity';
import GroupMemberEntity from './data/datasources/entities/group-member-entity';
import { AddGroupMemberUsecase } from './domain/usecases/group-member/add-group-member-usecase';
import { ChangeGroupOwnerUsecase } from './domain/usecases/group/change-group-owner-usecase';
import { CheckGroupMemberExistsUsecase } from './domain/usecases/group-member/check-group-member-exists-usecase';
import { CreateGroupUsecase } from './domain/usecases/group/create-group-usecase';
import { DeleteGroupUsecase } from './domain/usecases/group/delete-group-usecase';
import { forwardRef, Module } from '@nestjs/common';
import { GetCountGroupMembersUsecase } from './domain/usecases/group-member/get-count-group-member-usecase';
import { GetGroupMemberUsecase } from './domain/usecases/group-member/get-group-member-usecase';
import { GetGroupUsecase } from './domain/usecases/group/get-group-usecase';
import { GroupController } from './app/http/controllers/api/user/v1/group-controller';
import { GroupDatasource } from './data/datasources/group-datasource';
import { GroupMemberController } from './app/http/controllers/api/user/v1/group-member-controller';
import { GroupMemberDatasource } from './data/datasources/group-member-datasource';
import { GroupMemberRepository } from './domain/repositories/group-member-repository';
import { GroupMemberRepositoryImpl } from './data/repositories/group-member-repository-impl';
import { GroupRepository } from './domain/repositories/group-repository';
import { GroupRepositoryImpl } from './data/repositories/group-repository-impl';
import { ListGroupMembersUsecase } from './domain/usecases/group-member/list-group-members-usecase';
import { ListGroupsUsecase } from './domain/usecases/group/list-groups-usecase';
import { RemoveAllGroupMemberUsecase } from './domain/usecases/group-member/remove-all-group-member-usecase';
import { RemoveGroupMemberUsecase } from './domain/usecases/group-member/remove-group-member-usecase';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UpdateGroupUsecase } from './domain/usecases/group/update-group-usecase';
import { UserModule } from '../user/user-module';

@Module({
  imports: [TypeOrmModule.forFeature([GroupEntity, GroupMemberEntity]), forwardRef(() => UserModule)],
  controllers: [GroupController, GroupMemberController],
  providers: [
    {
      provide: GroupRepository,
      useClass: GroupRepositoryImpl,
    },
    GroupDatasource,
    ChangeGroupOwnerUsecase,
    CreateGroupUsecase,
    DeleteGroupUsecase,
    GetGroupUsecase,
    ListGroupsUsecase,
    UpdateGroupUsecase,
    {
      provide: GroupMemberRepository,
      useClass: GroupMemberRepositoryImpl,
    },
    GroupMemberDatasource,
    AddGroupMemberUsecase,
    CheckGroupMemberExistsUsecase,
    GetGroupMemberUsecase,
    ListGroupMembersUsecase,
    RemoveGroupMemberUsecase,
    RemoveAllGroupMemberUsecase,
    GetCountGroupMembersUsecase,
  ],
  exports: [RemoveGroupMemberUsecase, ListGroupsUsecase],
})
export class GroupModule {}
