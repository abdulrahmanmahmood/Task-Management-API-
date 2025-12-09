import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeRefreshTokenNullable1765262740758 implements MigrationInterface {
    name = 'MakeRefreshTokenNullable1765262740758'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "hashedRefreshToken" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "hashedRefreshToken" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "hashedRefreshToken" SET DEFAULT 'changeme123'`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "hashedRefreshToken" SET NOT NULL`);
    }

}
