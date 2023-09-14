import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { GetUserListQueryDto } from '../../../../../dtos/user-dto';
import { normalizeResponseData } from 'src/core/helpers/utils';
import { Response } from 'express';
import { UserAuthGuard } from 'src/modules/auth/guards/user-auth-guard';
import { UserModel } from 'src/modules/user/domain/models/user-model';
import { PaginationParams } from 'src/core/models/pagination-params';
import { SortParams } from 'src/core/models/sort-params';
import { GetUsersUsecase } from 'src/modules/user/domain/usecases/get-users-usecase';

@ApiTags('User \\ User')
@ApiBearerAuth()
@UseGuards(UserAuthGuard)
@Controller({ path: 'api/user/v1/users' })
export class UserController {
  constructor(private readonly getUsersUsecase: GetUsersUsecase) {}

  /**
   * Get list of user
   */
  @ApiResponse({ type: [UserModel] })
  @Get()
  async list(@Query() query: GetUserListQueryDto, @Res() res: Response) {
    const pageList = await this.getUsersUsecase.call(
      new PaginationParams(query.page, query.limit, query.need_total_count, query.only_count),
      new SortParams(query.sort, query.dir),
      undefined,
    );

    if (pageList.totalCount !== undefined) {
      res.setHeader('X-Total-Count', pageList.totalCount);
    }
    res.json(normalizeResponseData(pageList));
  }
}
