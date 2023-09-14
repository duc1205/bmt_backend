import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableUnique } from 'typeorm';

export class GroupMembers1694575217535 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'group_members',
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
            name: 'member_id',
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
      'group_members',
      new TableForeignKey({
        columnNames: ['member_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
      }),
    );

    await queryRunner.createForeignKey(
      'group_members',
      new TableForeignKey({
        columnNames: ['group_id'],
        referencedTableName: 'groups',
        referencedColumnNames: ['id'],
      }),
    );

    await queryRunner.createUniqueConstraint(
      'group_members',
      new TableUnique({
        name: 'group_members_member_id_group_id_unique',
        columnNames: ['member_id', 'group_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('group_members', true);
  }
}
