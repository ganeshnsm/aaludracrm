import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";

import configurations from "./config/configurations";
import { typeOrmConfig } from "./config/typeormconfig";

import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { CustomerModule } from "./modules/customer/customer.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configurations],
        }),
        TypeOrmModule.forRootAsync({
            useFactory: () => typeOrmConfig(),
        }),
        AuthModule,
        UsersModule,
        CustomerModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
