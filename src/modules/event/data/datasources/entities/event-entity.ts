import { EventModel } from 'src/modules/event/domain/model/event-model';
import { EventScope } from 'src/modules/event/enum/event-scope-enum';
import { Column, Entity, PrimaryColumn } from 'typeorm';

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
  start_time!: Date;

  @Column()
  finish_time!: Date;

  @Column()
  scope!: EventScope;

  @Column()
  created_at!: Date;

  @Column()
  updated_at!: Date;

  toModel(): EventModel {
    return new EventModel(
      this.id,
      this.title,
      this.description,
      this.current_count,
      this.max_count,
      this.start_time,
      this.finish_time,
      this.scope,
      this.created_at,
      this.updated_at,
    );
  }
}
