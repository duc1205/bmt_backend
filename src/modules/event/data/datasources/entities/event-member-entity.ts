import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import EventEntity from './event-entity';
import UserEntity from 'src/modules/user/data/datasources/entities/user-entity';
import { EventMemberModel } from 'src/modules/event/domain/model/event-member-model';

@Entity('event_members')
export default class EventMemberEntity {
  @PrimaryColumn()
  id!: string;

  @Column()
  member_id!: string;

  @Column()
  event_id!: string;

  @Column()
  created_at!: Date;

  @Column()
  updated_at!: Date;

  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'member_id' })
  member?: UserEntity;

  @OneToOne(() => EventEntity)
  @JoinColumn({ name: 'event_id' })
  event?: EventEntity;

  toModel(): EventMemberModel {
    return new EventMemberModel(
      this.id,
      this.member_id,
      this.event_id,
      this.created_at,
      this.updated_at,
      this.member?.toModel(),
      this.event?.toModel(),
    );
  }
}
