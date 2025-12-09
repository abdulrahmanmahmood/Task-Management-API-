import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOrganizationTableColumn1765289573395 implements MigrationInterface {
    name = 'AddOrganizationTableColumn1765289573395'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organizations" ADD "OwnerId" uuid`);
        await queryRunner.query(`ALTER TABLE "organizations" ADD CONSTRAINT "UQ_4b3514fb1d28b6e99dbfd8ac9bf" UNIQUE ("OwnerId")`);
        await queryRunner.query(`ALTER TABLE "organizations" ADD CONSTRAINT "FK_4b3514fb1d28b6e99dbfd8ac9bf" FOREIGN KEY ("OwnerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organizations" DROP CONSTRAINT "FK_4b3514fb1d28b6e99dbfd8ac9bf"`);
        await queryRunner.query(`ALTER TABLE "organizations" DROP CONSTRAINT "UQ_4b3514fb1d28b6e99dbfd8ac9bf"`);
        await queryRunner.query(`ALTER TABLE "organizations" DROP COLUMN "OwnerId"`);
    }

}
