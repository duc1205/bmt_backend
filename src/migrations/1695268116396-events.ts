import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Events1695268116396 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'events',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
          },
          {
            name: 'title',
            type: 'varchar',
          },
          {
            name: 'description',
            type: 'text',
          },
          {
            name: 'current_count',
            type: 'int',
          },
          {
            name: 'max_count',
            type: 'int',
          },
          {
            name: 'start_time',
            type: 'timestamp',
          },
          {
            name: 'finish_time',
            type: 'timestamp',
          },
          {
            name: 'scope',
            type: 'varchar',
          },
          {
            name: 'created_at',
            type: 'timestamp',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('events', true);
  }
}
