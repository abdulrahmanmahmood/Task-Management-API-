import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedDefaultValueFor1765210070439 implements MigrationInterface {
    name = 'AddedDefaultValueFor1765210070439'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "refreshToken" character varying NOT NULL DEFAULT 'changeme123'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "refreshToken"`);
    }

}
