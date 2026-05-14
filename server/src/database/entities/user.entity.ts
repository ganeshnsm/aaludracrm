import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

@Entity({ name: "users" })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 500, nullable: false })
    name: string;

    @Column({ type: "varchar", length: 20, unique: true, nullable: true })
    phone_number: string | null;

    @Column({ type: "varchar", length: 254, unique: true, nullable: false })
    email: string;

    @Column({ type: "varchar", length: 500, nullable: true, default: null })
    password: string | null;

    @Column({ type: "bigint", nullable: true, default: null })
    last_login: number | null;

    @Column({ type: "int", default: 1 })
    status: number;

    // @Column({ type: "varchar", length: 30, default: "Admin", nullable: false })
    // user_role: string;

    @Column({ type: "boolean", default: false })
    is_deleted: boolean;

    @Column({ type: "bigint", nullable: false, default: () => "EXTRACT(EPOCH FROM NOW())::bigint" })
    created_at: number;

    @Column({ type: "bigint", nullable: true })
    updated_at: number | null;
}
