import { EventModel } from 'src/modules/event/domain/model/event-model';
import { EventScope } from 'src/modules/event/enum/event-scope-enum';
import GroupEntity from 'src/modules/group/data/datasources/entities/group-entity';
import UserEntity from 'src/modules/user/data/datasources/entities/user-entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

@Entity('events')
export default class EventEntity {
  @PrimaryColumn()
  id!: string;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column()
  current_count!: number;

  @Column()
  max_count!: number;

  @Column()
  group_id?: string;

  @Column()
  organizer_id!: string;

  @Column()
  start_time!: Date;

  @Column()
  finish_time!: Date;

  @Column()
  scope!: EventScope;

  @Column()
  created_at!: Date;

  @Column()
  updated_at!: Date;

  @OneToOne(() => GroupEntity)
  @JoinColumn({ name: 'group_id' })
  group?: GroupEntity;

  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'organizer_id' })
  organizer?: UserEntity;

  toModel(): EventModel {
    return new EventModel(
      this.id,
      this.title,
      this.description,
      this.group_id,
      this.organizer_id,
      this.current_count,
      this.max_count,
      this.start_time,
      this.finish_time,
      this.scope,
      this.created_at,
      this.updated_at,
      this.group?.toModel(),
      this.organizer?.toModel(),
    );
  }
}
