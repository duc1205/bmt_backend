import { AuthPayloadModel } from '../../models/auth-payload-model';
import { AuthProvider } from '../../providers/auth-provider';
import { Injectable } from '@nestjs/common';
import { v4 as uuidV4 } from 'uuid';

@Injectable()
export class CreateAuthPayloadUsecase {
  async call(authenticatableId: string, provider: AuthProvider): Promise<AuthPayloadModel> {
    return new AuthPayloadModel(uuidV4(), authenticatableId, provider, new Date());
  }
}
