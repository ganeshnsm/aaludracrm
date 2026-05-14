import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { User } from "../../database/entities/user.entity";
import { UserDto } from "./dto/users.dto";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private readonly users: Repository<User>,
    ) {}

    findAll() {
        return this.users.find({
            where: { is_deleted: false },
            select: [
                "id",
                "name",
                "email",
                "phone_number",
                "last_login",
                "status",
                "created_at",
                "updated_at",
            ],
            order: { id: "ASC" },
        });
    }

    async findOne(id: number) {
        const user = await this.users.findOne({
            where: { id, is_deleted: false },
        });
        if (!user) throw new NotFoundException("User not found");
        const { password, ...rest } = user;
        return rest;
    }

    async update(id: number, dto: UserDto) {
        const user = await this.users.findOne({
            where: { id, is_deleted: false },
        });
        if (!user) throw new NotFoundException("User not found");

        if (dto.name !== undefined) user.name = dto.name;
        if (dto.email !== undefined) user.email = dto.email;
        user.updated_at = Math.floor(Date.now() / 1000);

        const saved = await this.users.save(user);
        const { password, ...rest } = saved;
        return rest;
    }

    async remove(id: number) {
        const user = await this.users.findOne({
            where: { id, is_deleted: false },
        });
        if (!user) throw new NotFoundException("User not found");

        user.is_deleted = true;
        user.updated_at = Math.floor(Date.now() / 1000);
        await this.users.save(user);
        return { id, deleted: true };
    }
}
