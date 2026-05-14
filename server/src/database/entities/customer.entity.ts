import {
    Entity,
    Index,
    PrimaryGeneratedColumn,
    Column,
    JoinColumn,
    ManyToOne,
} from "typeorm";
import { Company } from "./company.entity";

export enum CustomerType {
    USER = "user",
}

@Entity("customers")
@Index("idx_customers_email_project", ["email", "project_id"], { where: '"is_deleted" = false' })
@Index("idx_customers_blocked_project", ["is_blocked", "project_id"], { where: '"is_blocked" = true' })
export class Customer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "uuid", default: () => "uuid_generate_v4()" })
    uuid: string;

    @Column({ type: "varchar", length: 100 })
    name: string;

    @Column({ type: "varchar", length: 150 })
    email: string;

    @Column({ type: "varchar", length: 20, nullable: true })
    phone?: string;

    @Column({ type: "varchar", length: 150, nullable: true })
    company?: string;

    @Column({ type: "bigint", nullable: false, default: () => "EXTRACT(EPOCH FROM NOW())::bigint" })
    created_at: number;

    @Column({ type: "boolean", default: false })
    is_deleted: boolean;

    @ManyToOne(() => Company, { nullable: true, onDelete: "CASCADE" })
    @JoinColumn({ name: "company_id" })
    companies: Company;

    @Column({ type: "bigint", nullable: true })
    last_visit: number | null;

    @Column({ type: "int", nullable: true })
    company_id: number;

    @Column({ type: "int", nullable: true })
    project_id: number | null;

    @Column({ type: "boolean", default: false })
    is_blocked: boolean;
}
