import { UserModel } from 'src/modules/user/domain/models/user-model';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('users')
export default class UserEntity {
  @PrimaryColumn()
  id!: string;

  @Column()
  name!: string;

  @Column()
  password!: string;

  @Column()
  phone_number!: string;

  @Column()
  avatar_path?: string;

  @Column()
  created_at!: Date;

  @Column()
  updated_at!: Date;

  toModel(): UserModel {
    return new UserModel(
      this.id,
      this.password,
      this.name,
      this.phone_number,
      this.avatar_path,
      this.created_at,
      this.updated_at,
    );
  }
}
