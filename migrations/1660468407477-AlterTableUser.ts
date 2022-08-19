import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableUser1660468407477 implements MigrationInterface {
  name = 'AlterTableUser1660468407477';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE \`token\` (
                \`id\` bigint NOT NULL AUTO_INCREMENT,
                \`user_id\` int NOT NULL,
                \`accessToken\` varchar(255) NOT NULL,
                \`expiresIn\` int NOT NULL,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                INDEX \`IDX_e50ca89d635960fda2ffeb1763\` (\`user_id\`),
                UNIQUE INDEX \`IDX_f3db10d68154bc95175a641635\` (\`accessToken\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            CREATE TABLE \`user\` (
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`id\` bigint NOT NULL AUTO_INCREMENT,
                \`first_name\` varchar(255) NOT NULL,
                \`last_name\` varchar(255) NOT NULL,
                \`username\` varchar(255) NOT NULL,
                \`password\` varchar(255) NOT NULL,
                UNIQUE INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` (\`username\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` ON \`user\`
        `);
    await queryRunner.query(`
            DROP TABLE \`user\`
        `);
    await queryRunner.query(`
            DROP INDEX \`IDX_f3db10d68154bc95175a641635\` ON \`token\`
        `);
    await queryRunner.query(`
            DROP INDEX \`IDX_e50ca89d635960fda2ffeb1763\` ON \`token\`
        `);
    await queryRunner.query(`
            DROP TABLE \`token\`
        `);
  }
}
