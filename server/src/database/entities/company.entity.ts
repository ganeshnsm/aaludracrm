import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { User } from "./user.entity";

@Entity("companies")
export class Company {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, { onDelete: "CASCADE" })
    @JoinColumn({ name: "owner_id" })
    owner: User;

    @Column({ type: "varchar", length: 500 })
    company_name: string;

    @Column({ type: "varchar", length: 250 })
    company_email: string;

    @Column({ type: "varchar", length: 500 })
    company_size: string;
    @Column({
        type: "varchar",
        nullable: true,
        default: () => "'COMP_' || upper(substr(md5(random()::text), 1, 6))",
    })
    company_code: string | null;

    @Column({
        type: "bigint",
        name: "created_at",
        nullable: false,
        default: () => "EXTRACT(EPOCH FROM NOW())::bigint",
    })
    created_at: number;

    @Column({
        type: "bigint",
        name: "updated_at",
        nullable: true,
    })
    updated_at: number | null;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: "created_by" })
    created_by: User;

    @Column({ type: "boolean", default: false })
    is_deleted: boolean;
}
