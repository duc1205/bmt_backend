import { Injectable } from '@nestjs/common';
import GroupEntity from './entities/group-entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupModel } from '../../domain/models/group-model';
import { PaginationParams } from 'src/core/models/pagination-params';
import { SortParams } from 'src/core/models/sort-params';
import { UserModel } from 'src/modules/user/domain/models/user-model';
import { PageList } from 'src/core/models/page-list';
import { GetGroupBody, UpdateGroupInterface } from '../../domain/interfaces/group-interface';

@Injectable()
export class GroupDatasource {
  constructor(
    @InjectRepository(GroupEntity)
    private readonly groupRepository: Repository<GroupEntity>,
  ) {}

  async create(group: GroupModel): Promise<void> {
    const entity = new GroupEntity();
    entity.id = group.id;
    entity.name = group.name;
    entity.owner_id = group.ownerId;
    entity.created_at = group.createdAt;
    entity.updated_at = group.updatedAt;
    entity.avatar_path = <string | undefined>group.avatarPath;

    await this.groupRepository.insert(entity);
  }

  async list(
    paginationParams: PaginationParams,
    sortParams: SortParams,
    user: UserModel | undefined,
    relations: string[] | undefined,
  ): Promise<PageList<GroupModel>> {
    const condition: FindOptionsWhere<GroupEntity> = {};
    const orderBy: Record<any, any> = {};
    orderBy[sortParams.sort] = sortParams.dir;

    const query = this.groupRepository.createQueryBuilder().setFindOptions({
      where: condition,
      order: orderBy,
      skip: (paginationParams.page - 1) * paginationParams.limit,
      take: paginationParams.limit,
      relations: relations,
    });

    if (user) {
      query.andWhere(
        'EXISTS(SELECT id from group_members WHERE group_members.group_id = GroupEntity.id AND group_members.member_id = :member_id LIMIT 1)',
        {
          member_id: user.id,
        },
      );
    }

    let groups: Array<GroupEntity> = [];
    if (!paginationParams.onlyCount) {
      groups = await query.getMany();
    }

    let totalCount = undefined;
    if (paginationParams.needTotalCount) {
      totalCount = await query.getCount();
    }

    return new PageList(
      paginationParams.page,
      totalCount,
      groups.map((entity) => entity.toModel()),
    );
  }

  async get(body: GetGroupBody): Promise<GroupModel | undefined> {
    const condition: FindOptionsWhere<GroupEntity> = {};

    condition.id = body.id;

    return (
      await this.groupRepository.findOne({
        where: condition,
      })
    )?.toModel();
  }

  async update(group: GroupModel, body: UpdateGroupInterface): Promise<void> {
    await this.groupRepository.update(group.id, {
      ...(body.name && { name: body.name }),
      ...{ avatar_path: <string>body.avatarPath },
      updated_at: new Date(),
    });
  }

  async delete(group: GroupModel): Promise<void> {
    await this.groupRepository.delete(group.id);
  }

  async changeOwner(group: GroupModel, owner: UserModel): Promise<void> {
    await this.groupRepository.update(group.id, {
      owner_id: owner.id,
      updated_at: new Date(),
    });
  }
}
