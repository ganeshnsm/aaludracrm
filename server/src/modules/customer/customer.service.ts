import {
    ConflictException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Customer } from "../../database/entities/customer.entity";
import { CreateCustomerDto, UpdateCustomerDto } from "./dto/customer.dto";

@Injectable()
export class CustomerService {
    constructor(
        @InjectRepository(Customer)
        private readonly customers: Repository<Customer>,
    ) {}

    async create(dto: CreateCustomerDto) {
        const existing = await this.customers.findOne({
            where: {
                email: dto.email,
                is_deleted: false,
                ...(dto.company_id !== undefined && {
                    company_id: dto.company_id,
                }),
            },
        });
        if (existing) {
            throw new ConflictException(
                "A customer with this email already exists",
            );
        }
        const customer = this.customers.create(dto);
        return this.customers.save(customer);
    }

    findAll(companyId?: number) {
        return this.customers.find({
            where: {
                is_deleted: false,
                ...(companyId !== undefined && { company_id: companyId }),
            },
            order: { id: "DESC" },
        });
    }

    async findOne(id: number) {
        const customer = await this.customers.findOne({
            where: { id, is_deleted: false },
        });
        if (!customer) throw new NotFoundException("Customer not found");
        return customer;
    }

    async update(id: number, dto: UpdateCustomerDto) {
        const customer = await this.findOne(id);
        Object.assign(customer, dto);
        return this.customers.save(customer);
    }

    async remove(id: number) {
        const customer = await this.findOne(id);
        customer.is_deleted = true;
        await this.customers.save(customer);
        return { id, deleted: true };
    }
}
