import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1778755857930 implements MigrationInterface {
    name = 'InitSchema1778755857930'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" character varying(500) NOT NULL, "phone_number" character varying(20), "email" character varying(254) NOT NULL, "password" character varying(500), "last_login" bigint, "status" integer NOT NULL DEFAULT '1', "is_deleted" boolean NOT NULL DEFAULT false, "created_at" bigint NOT NULL DEFAULT EXTRACT(EPOCH FROM NOW())::bigint, "updated_at" bigint, CONSTRAINT "UQ_17d1817f241f10a3dbafb169fd2" UNIQUE ("phone_number"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "companies" ("id" SERIAL NOT NULL, "company_name" character varying(500) NOT NULL, "company_email" character varying(250) NOT NULL, "company_size" character varying(500) NOT NULL, "company_code" character varying DEFAULT 'COMP_' || upper(substr(md5(random()::text), 1, 6)), "created_at" bigint NOT NULL DEFAULT EXTRACT(EPOCH FROM NOW())::bigint, "updated_at" bigint, "is_deleted" boolean NOT NULL DEFAULT false, "owner_id" integer, "created_by" integer, CONSTRAINT "PK_d4bc3e82a314fa9e29f652c2c22" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "customers" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "email" character varying(150) NOT NULL, "phone" character varying(20), "company" character varying(150), "created_at" bigint NOT NULL DEFAULT EXTRACT(EPOCH FROM NOW())::bigint, "is_deleted" boolean NOT NULL DEFAULT false, "last_visit" bigint, "company_id" integer, "project_id" integer, "is_blocked" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_customers_blocked_project" ON "customers" ("is_blocked", "project_id") WHERE "is_blocked" = true`);
        await queryRunner.query(`CREATE INDEX "idx_customers_email_project" ON "customers" ("email", "project_id") WHERE "is_deleted" = false`);
        await queryRunner.query(`ALTER TABLE "companies" ADD CONSTRAINT "FK_df63e1563bbd91b428b5c50d8ad" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "companies" ADD CONSTRAINT "FK_ca4df9b8772f1c1a02f3a560555" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customers" ADD CONSTRAINT "FK_f0e29920aaf871f3eddbea69f0d" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customers" DROP CONSTRAINT "FK_f0e29920aaf871f3eddbea69f0d"`);
        await queryRunner.query(`ALTER TABLE "companies" DROP CONSTRAINT "FK_ca4df9b8772f1c1a02f3a560555"`);
        await queryRunner.query(`ALTER TABLE "companies" DROP CONSTRAINT "FK_df63e1563bbd91b428b5c50d8ad"`);
        await queryRunner.query(`DROP INDEX "public"."idx_customers_email_project"`);
        await queryRunner.query(`DROP INDEX "public"."idx_customers_blocked_project"`);
        await queryRunner.query(`DROP TABLE "customers"`);
        await queryRunner.query(`DROP TABLE "companies"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
