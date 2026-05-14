import {
    ConflictException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import {
    Customer,
    CustomerStatus,
} from "../../database/entities/customer.entity";
import {
    CreateCustomerDto,
    ListCustomersQueryDto,
    UpdateCustomerDto,
} from "./dto/customer.dto";

export interface CustomerJson {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    company: string | null;
    status: CustomerStatus;
    createdAt: string;
    updatedAt: string;
}

@Injectable()
export class CustomerService {
    constructor(
        @InjectRepository(Customer)
        private readonly customers: Repository<Customer>,
    ) {}

    async findAll(
        ownerId: number,
        query: ListCustomersQueryDto,
    ): Promise<CustomerJson[]> {
        const qb = this.customers
            .createQueryBuilder("c")
            .where("c.owner_id = :ownerId", { ownerId })
            .andWhere("c.is_deleted = false");

        if (query.search) {
            qb.andWhere(
                "(LOWER(c.name) LIKE :q OR LOWER(c.email) LIKE :q)",
                { q: `%${query.search.toLowerCase()}%` },
            );
        }

        if (query.status) {
            qb.andWhere("c.status = :status", { status: query.status });
        }

        qb.orderBy("c.created_at", "DESC");

        const rows = await qb.getMany();
        return rows.map((c) => this.toJson(c));
    }

    async stats(ownerId: number) {
        const rows = await this.customers
            .createQueryBuilder("c")
            .select("c.status", "status")
            .addSelect("COUNT(*)", "count")
            .where("c.owner_id = :ownerId", { ownerId })
            .andWhere("c.is_deleted = false")
            .groupBy("c.status")
            .getRawMany<{ status: CustomerStatus; count: string }>();

        const buckets = { active: 0, inactive: 0, lead: 0 };
        let total = 0;
        for (const row of rows) {
            const n = parseInt(row.count, 10) || 0;
            buckets[row.status] = n;
            total += n;
        }
        return { total, ...buckets };
    }

    async findOne(ownerId: number, id: number): Promise<CustomerJson> {
        const customer = await this.customers.findOne({
            where: { id, owner_id: ownerId, is_deleted: false },
        });
        if (!customer) throw new NotFoundException("Customer not found");
        return this.toJson(customer);
    }

    async create(
        ownerId: number,
        dto: CreateCustomerDto,
    ): Promise<CustomerJson> {
        const existing = await this.customers.findOne({
            where: {
                owner_id: ownerId,
                email: dto.email,
                is_deleted: false,
            },
        });
        if (existing) {
            throw new ConflictException(
                "A customer with this email already exists",
            );
        }
        const customer = this.customers.create({
            owner_id: ownerId,
            name: dto.name,
            email: dto.email,
            phone: dto.phone ?? null,
            company: dto.company ?? null,
            status: dto.status ?? CustomerStatus.LEAD,
        });
        const saved = await this.customers.save(customer);
        return this.toJson(saved);
    }

    async update(
        ownerId: number,
        id: number,
        dto: UpdateCustomerDto,
    ): Promise<CustomerJson> {
        const customer = await this.customers.findOne({
            where: { id, owner_id: ownerId, is_deleted: false },
        });
        if (!customer) throw new NotFoundException("Customer not found");

        if (dto.email && dto.email !== customer.email) {
            const dup = await this.customers.findOne({
                where: {
                    owner_id: ownerId,
                    email: dto.email,
                    is_deleted: false,
                },
            });
            if (dup) {
                throw new ConflictException(
                    "A customer with this email already exists",
                );
            }
        }

        Object.assign(customer, {
            ...(dto.name !== undefined && { name: dto.name }),
            ...(dto.email !== undefined && { email: dto.email }),
            ...(dto.phone !== undefined && { phone: dto.phone }),
            ...(dto.company !== undefined && { company: dto.company }),
            ...(dto.status !== undefined && { status: dto.status }),
        });
        const saved = await this.customers.save(customer);
        return this.toJson(saved);
    }

    async remove(ownerId: number, id: number) {
        const customer = await this.customers.findOne({
            where: { id, owner_id: ownerId, is_deleted: false },
        });
        if (!customer) throw new NotFoundException("Customer not found");
        customer.is_deleted = true;
        await this.customers.save(customer);
        return { success: true };
    }

    private toJson(c: Customer): CustomerJson {
        return {
            id: c.id,
            name: c.name,
            email: c.email,
            phone: c.phone,
            company: c.company,
            status: c.status,
            createdAt: c.created_at.toISOString(),
            updatedAt: c.updated_at.toISOString(),
        };
    }
}
