import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { GetUsersQueryDto } from '../../../../../dtos/user-dto';
import { normalizeResponseData, throwError } from 'src/core/helpers/utils';
import { Response } from 'express';
import { UserAuthGuard } from 'src/modules/auth/guards/user-auth-guard';
import { UserModel } from 'src/modules/user/domain/models/user-model';
import { PaginationParams } from 'src/core/models/pagination-params';
import { SortParams } from 'src/core/models/sort-params';
import { GetUsersUsecase } from 'src/modules/user/domain/usecases/get-users-usecase';
import { AuthPayloadModel } from 'src/modules/auth/domain/models/auth-payload-model';
import { GetUserUsecase } from 'src/modules/user/domain/usecases/get-user-usecase';

@ApiTags('User \\ User')
@ApiBearerAuth()
@UseGuards(UserAuthGuard)
@Controller({ path: 'api/user/v1/users' })
export class UserController {
  constructor(private readonly getUsersUsecase: GetUsersUsecase, private readonly getUserUsecase: GetUserUsecase) {}

  /**
   * Get list of user
   */
  @ApiResponse({ type: [UserModel] })
  @Get()
  async list(@Req() req: any, @Query() query: GetUsersQueryDto, @Res() res: Response) {
    const authPayload: AuthPayloadModel = req.user;
    const user = (await this.getUserUsecase.call({ id: authPayload.authenticatableId })) ?? throwError();

    const pageList = await this.getUsersUsecase.call(
      new PaginationParams(query.page, query.limit, query.need_total_count, query.only_count),
      new SortParams(query.sort, query.dir),
      [user],
      undefined,
    );

    if (pageList.totalCount !== undefined) {
      res.setHeader('X-Total-Count', pageList.totalCount);
    }
    res.json(normalizeResponseData(pageList));
  }
}
