import UserEntity from './entities/user-entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { GetUserBody, UpdateUserInterface } from '../../domain/interfaces/user-interface';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageList } from '../../../../core/models/page-list';
import { PaginationParams } from '../../../../core/models/pagination-params';
import { SortParams } from '../../../../core/models/sort-params';
import { UserModel } from '../../domain/models/user-model';
import { PhoneNumberModel } from 'src/modules/phone-number/domain/models/phone-number-model';

@Injectable()
export class UserDatasource {
  constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>) {}

  async create(user: UserModel): Promise<void> {
    const entity = new UserEntity();
    entity.id = user.id;
    entity.name = user.name;
    entity.password = user.password;
    entity.created_at = user.createdAt;
    entity.updated_at = user.updatedAt;
    entity.phone = user.phoneNumber;
    entity.avatar_path = <string | undefined>user.avatarPath;

    await this.userRepository.insert(entity);
  }

  async list(
    paginationParams: PaginationParams,
    sortParams: SortParams,
    relations: string[] | undefined,
  ): Promise<PageList<UserModel>> {
    const condition: FindOptionsWhere<UserEntity> = {};
    const orderBy: Record<any, any> = {};
    orderBy[sortParams.sort] = sortParams.dir;

    const query = this.userRepository.createQueryBuilder().setFindOptions({
      where: condition,
      order: orderBy,
      skip: (paginationParams.page - 1) * paginationParams.limit,
      take: paginationParams.limit,
      relations: relations,
    });

    let users: Array<UserEntity> = [];
    if (!paginationParams.onlyCount) {
      users = await query.getMany();
    }

    let totalCount = undefined;
    if (paginationParams.needTotalCount) {
      totalCount = await query.getCount();
    }

    return new PageList(
      paginationParams.page,
      totalCount,
      users.map((entity) => entity.toModel()),
    );
  }

  async get(body: GetUserBody): Promise<UserModel | undefined> {
    const condition: FindOptionsWhere<UserEntity> = {};

    condition.id = body.id;
    condition.phone = body.phoneNumber?.number;

    return (
      await this.userRepository.findOne({
        where: condition,
      })
    )?.toModel();
  }

  async update(user: UserModel, body: UpdateUserInterface): Promise<void> {
    await this.userRepository.update(user.id, {
      ...(body.name && { name: body.name }),
      ...{ avatar_path: <string>body.avatarPath },
      updated_at: new Date(),
    });
  }

  async changePassword(user: UserModel, password: string): Promise<void> {
    await this.userRepository.update(user.id, {
      password: password,
    });
  }

  async checkUserPhoneNumberExists(phoneNumber: PhoneNumberModel): Promise<boolean> {
    const condition: FindOptionsWhere<UserEntity> = {
      phone: phoneNumber.number,
    };

    return (await this.userRepository.createQueryBuilder().where(condition).getCount()) > 0;
  }

  async delete(user: UserModel): Promise<void> {
    await this.userRepository.delete(user.id);
  }
}
