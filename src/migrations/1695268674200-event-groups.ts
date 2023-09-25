import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableUnique } from 'typeorm';

export class EventGroups1695268674200 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'event_groups',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
          },
          {
            name: 'group_id',
            type: 'varchar',
          },
          {
            name: 'event_id',
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
      'event_groups',
      new TableForeignKey({
        columnNames: ['group_id'],
        referencedTableName: 'groups',
        referencedColumnNames: ['id'],
      }),
    );

    await queryRunner.createForeignKey(
      'event_groups',
      new TableForeignKey({
        columnNames: ['event_id'],
        referencedTableName: 'events',
        referencedColumnNames: ['id'],
      }),
    );

    await queryRunner.createUniqueConstraints('event_groups', [
      new TableUnique({
        name: 'event_groups_group_id_event_id_unique',
        columnNames: ['group_id', 'event_id'],
      }),
      new TableUnique({
        name: 'event_groups_event_id_unique',
        columnNames: ['event_id'],
      }),
    ]);

    await queryRunner.createUniqueConstraints;
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('event_groups', true);
  }
}
