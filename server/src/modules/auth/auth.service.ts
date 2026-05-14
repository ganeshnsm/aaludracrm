import {
    ConflictException,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

import { User } from "../../database/entities/user.entity";
import { SignupDto } from "./dto/signup.dto";
import { LoginDto } from "./dto/login.dto";
import { JwtPayload } from "./jwt.strategy";

const BCRYPT_ROUNDS = 10;

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private readonly users: Repository<User>,
        private readonly jwt: JwtService,
    ) {}

    async signup(dto: SignupDto) {
        const existing = await this.users.findOne({
            where: { email: dto.email, is_deleted: false },
        });
        if (existing) {
            throw new ConflictException("Email already registered");
        }

        const hash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
        const user = this.users.create({
            email: dto.email,
            name: dto.name,
            password: hash,
        });
        const saved = await this.users.save(user);
        return this.issueToken(saved);
    }

    async login(dto: LoginDto) {
        if (!dto.password) {
            throw new UnauthorizedException("Password is required");
        }
        const user = await this.users.findOne({
            where: { email: dto.email, is_deleted: false },
        });
        if (!user || !user.password) {
            throw new UnauthorizedException("Invalid credentials");
        }
        const ok = await bcrypt.compare(dto.password, user.password);
        if (!ok) {
            throw new UnauthorizedException("Invalid credentials");
        }

        user.last_login = Math.floor(Date.now() / 1000);
        await this.users.save(user);

        return this.issueToken(user);
    }

    private issueToken(user: User) {
        const payload: JwtPayload = { sub: user.id, email: user.email };
        return {
            access_token: this.jwt.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
        };
    }
}
