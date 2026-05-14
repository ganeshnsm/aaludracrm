import { NestFactory } from "@nestjs/core";
import { DataSource } from "typeorm";
import * as bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";

import { AppModule } from "../app.module";
import { User } from "../database/entities/user.entity";
import {
    Customer,
    CustomerStatus,
} from "../database/entities/customer.entity";

const DEMO_EMAIL = "demo@aaludra.com";
const DEMO_PASSWORD = "Demo@1234";
const DEMO_NAME = "Demo User";
const TOTAL = 1000;
const CHUNK = 500;

function pickStatus(): CustomerStatus {
    const r = Math.random();
    if (r < 0.5) return CustomerStatus.ACTIVE;
    if (r < 0.8) return CustomerStatus.LEAD;
    return CustomerStatus.INACTIVE;
}

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule, {
        logger: ["error", "warn"],
    });

    try {
        const dataSource = app.get(DataSource);
        const userRepo = dataSource.getRepository(User);
        const customerRepo = dataSource.getRepository(Customer);

        let demo = await userRepo.findOne({
            where: { email: DEMO_EMAIL, is_deleted: false },
        });
        const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
        if (!demo) {
            demo = userRepo.create({
                email: DEMO_EMAIL,
                name: DEMO_NAME,
                password: passwordHash,
            });
            demo = await userRepo.save(demo);
        } else {
            demo.password = passwordHash;
            demo.name = DEMO_NAME;
            demo = await userRepo.save(demo);
        }

        await customerRepo
            .createQueryBuilder()
            .delete()
            .where("owner_id = :id", { id: demo.id })
            .execute();

        const counts = { active: 0, lead: 0, inactive: 0 };
        const usedEmails = new Set<string>();
        const rows: Partial<Customer>[] = [];
        for (let i = 0; i < TOTAL; i++) {
            const status = pickStatus();
            counts[status] += 1;
            const first = faker.person.firstName();
            const last = faker.person.lastName();
            const name = `${first} ${last}`;
            let email = faker.internet
                .email({ firstName: first, lastName: last })
                .toLowerCase();
            while (usedEmails.has(email)) {
                email = `${faker.string.alphanumeric(6).toLowerCase()}.${email}`;
            }
            usedEmails.add(email);
            rows.push({
                owner_id: demo.id,
                name,
                email,
                phone: faker.phone.number(),
                company: faker.company.name(),
                status,
            });
        }

        for (let i = 0; i < rows.length; i += CHUNK) {
            const chunk = rows.slice(i, i + CHUNK);
            await customerRepo
                .createQueryBuilder()
                .insert()
                .into(Customer)
                .values(chunk)
                .execute();
        }

        // eslint-disable-next-line no-console
        console.log(
            `Seeded ${TOTAL} customers for ${DEMO_EMAIL} (active=${counts.active}, lead=${counts.lead}, inactive=${counts.inactive})`,
        );
    } finally {
        await app.close();
    }
}

bootstrap().catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
});
