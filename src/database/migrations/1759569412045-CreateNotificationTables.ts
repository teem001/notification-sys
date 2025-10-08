import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateNotificationTables1759569412045 implements MigrationInterface {
    name = 'CreateNotificationTables1759569412045'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "emails" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "trackingId" character varying NOT NULL, "toEmail" character varying NOT NULL, "message" text NOT NULL, "subject" text NOT NULL, "isHtml" boolean NOT NULL DEFAULT false, "provider" character varying, "delivered" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_234c310c32d6e461c589fa47f3b" UNIQUE ("trackingId"), CONSTRAINT "PK_a54dcebef8d05dca7e839749571" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "trackingId" character varying NOT NULL, "type" character varying NOT NULL, "recipient" character varying NOT NULL, "message" text NOT NULL, "subject" text NOT NULL, "delivered" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_f3a649e4884a97a34ebb1fb28a0" UNIQUE ("trackingId"), CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sms" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "trackingId" character varying NOT NULL, "toPhoneNumber" character varying NOT NULL, "message" text NOT NULL, "provider" character varying, "delivered" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e6b0715a50465a235de186510bd" UNIQUE ("trackingId"), CONSTRAINT "PK_60793c2f16aafe0513f8817eae8" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "sms"`);
        await queryRunner.query(`DROP TABLE "notifications"`);
        await queryRunner.query(`DROP TABLE "emails"`);
    }

}
