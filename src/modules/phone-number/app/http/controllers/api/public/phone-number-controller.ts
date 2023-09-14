import { Public } from '../../../../../../auth/decorators/metadata';
import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { PhoneNumberDto } from '../../../../dtos/phone-number-dto';
import { normalizeResponseData } from '../../../../../../../core/helpers/utils';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { PhoneNumberModel } from 'src/modules/phone-number/domain/models/phone-number-model';

@ApiTags('Public \\ Phone Number')
@Public()
@Controller({ path: 'api/v1/phone-numbers' })
export class PhoneNumberController {
  /**
   * Parse phone number
   */
  @ApiResponse({ status: 200, type: PhoneNumberModel })
  @Post('parse')
  async parsePhoneNumber(@Body() body: PhoneNumberDto, @Res() res: Response) {
    res.status(HttpStatus.OK).json(normalizeResponseData(body.phone_number));
  }
}
