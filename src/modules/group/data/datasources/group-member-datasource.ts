import GroupMemberEntity from './entities/group-member-entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { GroupMemberModel } from '../../domain/models/group-member-model';
import { GroupModel } from '../../domain/models/group-model';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageList } from 'src/core/models/page-list';
import { PaginationParams } from 'src/core/models/pagination-params';
import { SortParams } from 'src/core/models/sort-params';
import { GetGroupMemberBody, RemoveAllGroupMemberInterface } from '../../domain/interfaces/group-member-interface';
import { UserModel } from 'src/modules/user/domain/models/user-model';

@Injectable()
export class GroupMemberDatasource {
  constructor(
    @InjectRepository(GroupMemberEntity)
    private readonly groupMemberRepository: Repository<GroupMemberEntity>,
  ) {}

  async create(groupMember: GroupMemberModel): Promise<void> {
    const entity = new GroupMemberEntity();
    entity.id = groupMember.id;
    entity.group_id = groupMember.groupId;
    entity.member_id = groupMember.memberId;
    entity.created_at = groupMember.createdAt;
    entity.updated_at = groupMember.updatedAt;

    await this.groupMemberRepository.insert(entity);
  }

  async list(
    paginationParams: PaginationParams,
    sortParams: SortParams,
    group: GroupModel,
    relations: string[] | undefined,
  ): Promise<PageList<GroupMemberModel>> {
    const condition: FindOptionsWhere<GroupMemberEntity> = {};
    condition.group_id = group.id;

    const orderBy: Record<any, any> = {};
    orderBy[sortParams.sort] = sortParams.dir;

    const query = this.groupMemberRepository.createQueryBuilder().setFindOptions({
      where: condition,
      order: orderBy,
      skip: (paginationParams.page - 1) * paginationParams.limit,
      take: paginationParams.limit,
      relations: relations,
    });

    let groupMembers: Array<GroupMemberEntity> = [];
    if (!paginationParams.onlyCount) {
      groupMembers = await query.getMany();
    }

    let totalCount = undefined;
    if (paginationParams.needTotalCount) {
      totalCount = await query.getCount();
    }

    return new PageList(
      paginationParams.page,
      totalCount,
      groupMembers.map((entity) => entity.toModel()),
    );
  }

  async get(body: GetGroupMemberBody): Promise<GroupMemberModel | undefined> {
    const condition: FindOptionsWhere<GroupMemberEntity> = {};
    const { id, group, member } = body;

    condition.id = id;

    if (group && member) {
      condition.group_id = group.id;
      condition.member_id = member.id;
    }

    return (
      await this.groupMemberRepository.findOne({
        where: condition,
      })
    )?.toModel();
  }

  async remove(group: GroupModel, member: UserModel): Promise<void> {
    await this.groupMemberRepository.delete({ group_id: group.id, member_id: member.id });
  }

  async removeAll(body: RemoveAllGroupMemberInterface): Promise<void> {
    const { group, member } = body;
    const condition: FindOptionsWhere<GroupMemberEntity> = {};

    if (group) {
      condition.group_id = group.id;
    }

    if (member) {
      condition.member_id = member?.id;
    }

    await this.groupMemberRepository.delete(condition);
  }

  async checkExist(group: GroupModel, member: UserModel): Promise<boolean> {
    return (await this.groupMemberRepository.count({ where: { group_id: group.id, member_id: member.id } })) > 0;
  }

  async count(group: GroupModel): Promise<number> {
    return await this.groupMemberRepository.count({ where: { group_id: group.id } });
  }
}
