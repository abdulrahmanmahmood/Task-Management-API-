import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateProjectTableWithSoftDelete1765785251776 implements MigrationInterface {
    name = 'UpdateProjectTableWithSoftDelete1765785251776'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "FK_2700a12b18561e9b3724c19a14f"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "OrganizationId"`);
        await queryRunner.query(`ALTER TABLE "projects" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "projects" ADD "organizationId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "FK_f55144dc92df43cd1dad5d29b90"`);
        await queryRunner.query(`ALTER TABLE "projects" ALTER COLUMN "createdById" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "FK_eec93fd979bdcf5a0141da324d6" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "FK_f55144dc92df43cd1dad5d29b90" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "FK_f55144dc92df43cd1dad5d29b90"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "FK_eec93fd979bdcf5a0141da324d6"`);
        await queryRunner.query(`ALTER TABLE "projects" ALTER COLUMN "createdById" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "FK_f55144dc92df43cd1dad5d29b90" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "organizationId"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "projects" ADD "OrganizationId" uuid`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "FK_2700a12b18561e9b3724c19a14f" FOREIGN KEY ("OrganizationId") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
