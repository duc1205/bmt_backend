import { GroupModel } from 'src/modules/group/domain/models/group-model';
import UserEntity from 'src/modules/user/data/datasources/entities/user-entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

@Entity('groups')
export default class GroupEntity {
  @PrimaryColumn()
  id!: string;

  @Column()
  name!: string;

  @Column()
  owner_id!: string;

  @Column()
  avatar_path?: string;

  @Column()
  created_at!: Date;

  @Column()
  updated_at!: Date;

  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'owner_id' })
  owner?: UserEntity;

  toModel(): GroupModel {
    return new GroupModel(
      this.id,
      this.name,
      this.owner_id,
      this.avatar_path,
      this.created_at,
      this.updated_at,
      this.owner?.toModel(),
    );
  }
}
