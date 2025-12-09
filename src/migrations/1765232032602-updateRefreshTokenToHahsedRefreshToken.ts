import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateRefreshTokenToHahsedRefreshToken1765232032602 implements MigrationInterface {
    name = 'UpdateRefreshTokenToHahsedRefreshToken1765232032602'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "refreshToken" TO "hashedRefreshToken"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "hashedRefreshToken" TO "refreshToken"`);
    }

}
