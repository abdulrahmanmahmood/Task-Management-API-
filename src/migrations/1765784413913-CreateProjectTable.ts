import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProjectTable1765784413913 implements MigrationInterface {
    name = 'CreateProjectTable1765784413913'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."projects_status_enum" AS ENUM('planning', 'in_progress', 'completed', 'on_hold')`);
        await queryRunner.query(`CREATE TABLE "projects" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "status" "public"."projects_status_enum" NOT NULL DEFAULT 'planning', "startDate" date, "endDate" date, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "OrganizationId" uuid, "createdById" uuid, CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "FK_2700a12b18561e9b3724c19a14f" FOREIGN KEY ("OrganizationId") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "FK_f55144dc92df43cd1dad5d29b90" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "FK_f55144dc92df43cd1dad5d29b90"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "FK_2700a12b18561e9b3724c19a14f"`);
        await queryRunner.query(`DROP TABLE "projects"`);
        await queryRunner.query(`DROP TYPE "public"."projects_status_enum"`);
    }

}
