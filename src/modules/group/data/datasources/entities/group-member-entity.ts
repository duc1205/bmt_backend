import GroupEntity from './group-entity';
import UserEntity from 'src/modules/user/data/datasources/entities/user-entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { GroupMemberModel } from 'src/modules/group/domain/models/group-member-model';

@Entity('group_members')
export default class GroupMemberEntity {
  @PrimaryColumn()
  id!: string;

  @Column()
  group_id!: string;

  @Column()
  member_id!: string;

  @Column()
  created_at!: Date;

  @Column()
  updated_at!: Date;

  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'member_id' })
  member?: UserEntity;

  @OneToOne(() => GroupEntity)
  @JoinColumn({ name: 'group_id' })
  group?: GroupEntity;

  toModel(): GroupMemberModel {
    return new GroupMemberModel(
      this.id,
      this.group_id,
      this.member_id,
      this.created_at,
      this.updated_at,
      this.member?.toModel(),
      this.group?.toModel(),
    );
  }
}
