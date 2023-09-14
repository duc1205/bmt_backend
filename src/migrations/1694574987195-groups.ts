import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class Groups1694574987195 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'groups',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
          },

          {
            name: 'owner_id',
            type: 'varchar',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'avatar_path',
            type: 'varchar',
            isNullable: true,
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
      'groups',
      new TableForeignKey({
        columnNames: ['owner_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('groups', true);
  }
}
