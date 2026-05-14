import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

import { User } from "./user.entity";

export enum CustomerStatus {
    LEAD = "lead",
    ACTIVE = "active",
    INACTIVE = "inactive",
}

@Entity({ name: "customers" })
@Index("idx_customers_owner_name", ["owner_id", "name"])
@Index("idx_customers_owner_email", ["owner_id", "email"])
@Index("idx_customers_owner_status", ["owner_id", "status"])
@Index("idx_customers_owner_created", ["owner_id", "created_at"])
export class Customer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "int", nullable: false })
    owner_id: number;

    @ManyToOne(() => User, { onDelete: "CASCADE", nullable: false })
    @JoinColumn({ name: "owner_id" })
    owner: User;

    @Column({ type: "varchar", length: 120, nullable: false })
    name: string;

    @Column({ type: "varchar", length: 180, nullable: false })
    email: string;

    @Column({ type: "varchar", length: 40, nullable: true })
    phone: string | null;

    @Column({ type: "varchar", length: 160, nullable: true })
    company: string | null;

    @Column({
        type: "enum",
        enum: CustomerStatus,
        enumName: "customer_status",
        default: CustomerStatus.LEAD,
        nullable: false,
    })
    status: CustomerStatus;

    @CreateDateColumn({ type: "timestamptz", default: () => "now()" })
    created_at: Date;

    @UpdateDateColumn({ type: "timestamptz", default: () => "now()" })
    updated_at: Date;

    @Column({ type: "boolean", default: false })
    is_deleted: boolean;
}
