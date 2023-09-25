import GroupEntity from 'src/modules/group/data/datasources/entities/group-entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import EventEntity from './event-entity';
import { EventGroupModel } from 'src/modules/event/domain/model/event-group-model';

@Entity('event_groups')
export default class EventGroupEntity {
  @PrimaryColumn()
  id!: string;

  @Column()
  group_id!: string;

  @Column()
  event_id!: string;

  @Column()
  created_at!: Date;

  @Column()
  updated_at!: Date;

  @OneToOne(() => GroupEntity)
  @JoinColumn({ name: 'group_id' })
  group?: GroupEntity;

  @OneToOne(() => EventEntity)
  @JoinColumn({ name: 'event_id' })
  event?: EventEntity;

  toModel(): EventGroupModel {
    return new EventGroupModel(
      this.id,
      this.group_id,
      this.event_id,
      this.created_at,
      this.updated_at,
      this.group?.toModel(),
      this.event?.toModel(),
    );
  }
}
