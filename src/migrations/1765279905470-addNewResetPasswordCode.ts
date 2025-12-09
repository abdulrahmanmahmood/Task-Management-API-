import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNewResetPasswordCode1765279905470 implements MigrationInterface {
    name = 'AddNewResetPasswordCode1765279905470'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "resetPasswordCode" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "resetPasswordCode"`);
    }

}
