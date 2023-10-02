import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

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
            name: 'group_id',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'organizer_id',
            type: 'varchar',
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

    await queryRunner.createForeignKey(
      'events',
      new TableForeignKey({
        columnNames: ['organizer_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
      }),
    );

    await queryRunner.createForeignKey(
      'events',
      new TableForeignKey({
        columnNames: ['group_id'],
        referencedTableName: 'groups',
        referencedColumnNames: ['id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('events', true);
  }
}
