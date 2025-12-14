import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeOwnerToManyRelationship1765734557440 implements MigrationInterface {
    name = 'ChangeOwnerToManyRelationship1765734557440'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organizations" DROP CONSTRAINT "FK_4b3514fb1d28b6e99dbfd8ac9bf"`);
        await queryRunner.query(`ALTER TABLE "organizations" RENAME COLUMN "OwnerId" TO "Owner_id"`);
        await queryRunner.query(`ALTER TABLE "organizations" RENAME CONSTRAINT "UQ_4b3514fb1d28b6e99dbfd8ac9bf" TO "UQ_7edc1d41028ab10ca77902f6d69"`);
        await queryRunner.query(`ALTER TABLE "organizations" DROP CONSTRAINT "UQ_7edc1d41028ab10ca77902f6d69"`);
        await queryRunner.query(`ALTER TABLE "organizations" ADD CONSTRAINT "FK_7edc1d41028ab10ca77902f6d69" FOREIGN KEY ("Owner_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organizations" DROP CONSTRAINT "FK_7edc1d41028ab10ca77902f6d69"`);
        await queryRunner.query(`ALTER TABLE "organizations" ADD CONSTRAINT "UQ_7edc1d41028ab10ca77902f6d69" UNIQUE ("Owner_id")`);
        await queryRunner.query(`ALTER TABLE "organizations" RENAME CONSTRAINT "UQ_7edc1d41028ab10ca77902f6d69" TO "UQ_4b3514fb1d28b6e99dbfd8ac9bf"`);
        await queryRunner.query(`ALTER TABLE "organizations" RENAME COLUMN "Owner_id" TO "OwnerId"`);
        await queryRunner.query(`ALTER TABLE "organizations" ADD CONSTRAINT "FK_4b3514fb1d28b6e99dbfd8ac9bf" FOREIGN KEY ("OwnerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
