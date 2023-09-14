import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthPayloadModel } from 'src/modules/auth/domain/models/auth-payload-model';
import { Body, Controller, Delete, Get, HttpStatus, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ChangePasswordUserDto, GetUserListQueryDto, UpdateUserByMeDto } from '../../../../../dtos/user-dto';
import { ChangeUserPasswordUsecase } from 'src/modules/user/domain/usecases/change-user-password-usecase';
import { DeleteUserUsecase } from '../../../../../../domain/usecases/delete-user-usecase';
import { GetUserUsecase } from '../../../../../../domain/usecases/get-user-usecase';
import { normalizeResponseData, throwError } from 'src/core/helpers/utils';
import { Response } from 'express';
import { UpdateUserUsecase } from '../../../../../../domain/usecases/update-user-usecase';
import { UserAuthGuard } from 'src/modules/auth/guards/user-auth-guard';
import { UserModel } from 'src/modules/user/domain/models/user-model';
import { PaginationParams } from 'src/core/models/pagination-params';
import { SortParams } from 'src/core/models/sort-params';
import { GetUsersUsecase } from 'src/modules/user/domain/usecases/get-users-usecase';

@ApiTags('User \\ Me')
@ApiBearerAuth()
@UseGuards(UserAuthGuard)
@Controller({ path: 'api/user/v1/me' })
export class MeController {
  constructor(
    private readonly getUserUsecase: GetUserUsecase,
    private readonly changeUserPasswordUsecase: ChangeUserPasswordUsecase,
    private readonly updateUserUsecase: UpdateUserUsecase,
    private readonly deleteUserUsecase: DeleteUserUsecase,
    private readonly getUsersUsecase: GetUsersUsecase,
  ) {}

  /**
   *  Get profile
   */
  @ApiResponse({ type: UserModel })
  @Get('/')
  async getProfile(@Req() req: any, @Res() res: Response) {
    const authPayload: AuthPayloadModel = req.user;
    const user = (await this.getUserUsecase.call({ id: authPayload.authenticatableId })) ?? throwError();

    res.json(normalizeResponseData(user));
  }

  /**
   *  Update profile
   */
  @ApiResponse({ type: UserModel })
  @Put('/')
  async updateProfile(@Req() req: any, @Body() body: UpdateUserByMeDto, @Res() res: Response) {
    const authPayload: AuthPayloadModel = req.user;
    const user = (await this.getUserUsecase.call({ id: authPayload.authenticatableId })) ?? throwError();

    const updatedUser = await this.updateUserUsecase.call(user, {
      name: body.name,
      avatarPath: body.avatar_path,
    });

    res.json(normalizeResponseData(updatedUser, true));
  }

  /**
   *  Logout
   */
  @ApiResponse({ status: HttpStatus.OK, schema: { type: 'boolean' } })
  @Post('/logout')
  async logout(@Req() req: any, @Res() res: Response) {
    const authPayload: AuthPayloadModel = req.user;
    (await this.getUserUsecase.call({ id: authPayload.authenticatableId })) ?? throwError();

    res.status(HttpStatus.OK).json(normalizeResponseData(true));
  }

  /**
   *  Delete user account
   */
  @ApiResponse({ status: HttpStatus.OK, schema: { type: 'boolean' } })
  @Delete('/')
  async delete(@Req() req: any, @Res() res: Response) {
    const authPayload: AuthPayloadModel = req.user;
    const user = (await this.getUserUsecase.call({ id: authPayload.authenticatableId })) ?? throwError();

    await this.deleteUserUsecase.call(user);

    res.status(HttpStatus.OK).json(normalizeResponseData(true));
  }

  /**
   *  Change password
   */
  @ApiResponse({ schema: { type: 'boolean' } })
  @Put('/password/change')
  async changePassword(@Req() req: any, @Body() body: ChangePasswordUserDto, @Res() res: Response) {
    const authPayload: AuthPayloadModel = req.user;
    const user = (await this.getUserUsecase.call({ id: authPayload.authenticatableId })) ?? throwError();

    await this.changeUserPasswordUsecase.call(user, { password: body.new_password, oldPassword: body.old_password });

    res.json(normalizeResponseData(true));
  }

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
