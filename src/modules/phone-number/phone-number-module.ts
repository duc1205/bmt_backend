import { Module } from '@nestjs/common';
import { PhoneNumberController } from './app/http/controllers/api/public/phone-number-controller';

@Module({
  controllers: [PhoneNumberController],
})
export class PhoneNumberModule {}
