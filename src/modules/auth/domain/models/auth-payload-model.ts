import { DomainModel } from '../../../../core/models/domain-model';
import { AuthProvider } from '../providers/auth-provider';

export class AuthPayloadModel extends DomainModel {
  public readonly id: string;
  public readonly authenticatableId: string;
  public readonly provider: AuthProvider;
  public readonly createdAt: Date;

  constructor(id: string, authenticatableId: string, provider: AuthProvider, createdAt: Date) {
    super();
    this.id = id;
    this.authenticatableId = authenticatableId;
    this.provider = provider;
    this.createdAt = createdAt;
  }

  toJson(): Record<string, any> {
    return {
      id: this.id,
      user_id: this.authenticatableId,
      provider: this.provider,
      created_at: this.createdAt,
    };
  }
}
