import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { CreateUserDto } from '../../../../../dtos/user-dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserModel } from 'src/modules/user/domain/models/user-model';
import { normalizeResponseData, throwError } from 'src/core/helpers/utils';
import { CreateUserUsecase } from 'src/modules/user/domain/usecases/create-user-usecase';

@ApiTags('Public \\ User')
@Controller({ path: 'api/public/v1/user' })
export class UserController {
  constructor(private readonly createUserUsecase: CreateUserUsecase) {}

  /**
   *  Sign up
   */
  @ApiResponse({ type: UserModel })
  @Post('/')
  async getProfile(@Body() body: CreateUserDto, @Res() res: Response) {
    const user =
      (await this.createUserUsecase.call({
        name: body.name,
        avatarPath: body.avatar_path,
        password: body.password,
        phoneNumber: body.phone_number,
      })) ?? throwError();

    res.json(normalizeResponseData(user));
  }
}
