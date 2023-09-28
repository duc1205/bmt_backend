import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthPayloadModel } from 'src/modules/auth/domain/models/auth-payload-model';
import { Body, Controller, Get, HttpStatus, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { ChangePasswordUserDto, UpdateUserByMeDto } from '../../../../../dtos/user-dto';
import { ChangeUserPasswordUsecase } from 'src/modules/user/domain/usecases/change-user-password-usecase';
import { GetUserUsecase } from '../../../../../../domain/usecases/get-user-usecase';
import { normalizeResponseData, throwError } from 'src/core/helpers/utils';
import { Response } from 'express';
import { UpdateUserUsecase } from '../../../../../../domain/usecases/update-user-usecase';
import { UserAuthGuard } from 'src/modules/auth/guards/user-auth-guard';
import { UserModel } from 'src/modules/user/domain/models/user-model';

@ApiTags('User \\ Me')
@ApiBearerAuth()
@UseGuards(UserAuthGuard)
@Controller({ path: 'api/user/v1/me' })
export class MeController {
  constructor(
    private readonly getUserUsecase: GetUserUsecase,
    private readonly changeUserPasswordUsecase: ChangeUserPasswordUsecase,
    private readonly updateUserUsecase: UpdateUserUsecase,
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
}
