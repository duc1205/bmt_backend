import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { LoginUsecase } from '../../../domain/usecases/login-usecase';
import { Public } from '../../../decorators/metadata';
import { LoginAuthDto } from '../../dtos/auth-dto';
import { normalizeResponseData } from '../../../../../core/helpers/utils';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthBearerTokenModel } from '../../../domain/models/auth-bearer-token-model';

@ApiTags('Public \\ Login')
@Controller({ path: 'auth' })
export class AuthController {
  constructor(private readonly loginUsecase: LoginUsecase) {}

  /**
   * Login
   */
  @Public()
  @ApiResponse({ status: HttpStatus.OK, type: AuthBearerTokenModel })
  @Post('login')
  async login(@Body() body: LoginAuthDto, @Res() res: Response) {
    const authBearerTokenModel = await this.loginUsecase.call(
      body.client_id,
      body.client_secret,
      body.phone_number,
      body.password,
    );
    res.status(HttpStatus.OK).json(normalizeResponseData(authBearerTokenModel));
  }
}
