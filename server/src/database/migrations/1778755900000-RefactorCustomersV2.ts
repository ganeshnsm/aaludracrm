// -- WARNING: irreversible refactor for assignment scope
import { MigrationInterface, QueryRunner } from "typeorm";

export class RefactorCustomersV21778755900000 implements MigrationInterface {
    name = "RefactorCustomersV21778755900000";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "customers" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "companies" CASCADE`);
        await queryRunner.query(`DROP TYPE IF EXISTS "customer_status"`);
        await queryRunner.query(
            `CREATE TYPE "customer_status" AS ENUM ('lead','active','inactive')`,
        );
        await queryRunner.query(`
            CREATE TABLE "customers" (
                "id" SERIAL PRIMARY KEY,
                "owner_id" integer NOT NULL,
                "name" character varying(120) NOT NULL,
                "email" character varying(180) NOT NULL,
                "phone" character varying(40),
                "company" character varying(160),
                "status" "customer_status" NOT NULL DEFAULT 'lead',
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "is_deleted" boolean NOT NULL DEFAULT false,
                CONSTRAINT "FK_customers_owner" FOREIGN KEY ("owner_id")
                    REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
            )
        `);
        await queryRunner.query(
            `CREATE INDEX "idx_customers_owner_name" ON "customers" ("owner_id", "name")`,
        );
        await queryRunner.query(
            `CREATE INDEX "idx_customers_owner_email" ON "customers" ("owner_id", "email")`,
        );
        await queryRunner.query(
            `CREATE INDEX "idx_customers_owner_status" ON "customers" ("owner_id", "status")`,
        );
        await queryRunner.query(
            `CREATE INDEX "idx_customers_owner_created" ON "customers" ("owner_id", "created_at" DESC)`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "customers" CASCADE`);
        await queryRunner.query(`DROP TYPE IF EXISTS "customer_status"`);
    }
}
