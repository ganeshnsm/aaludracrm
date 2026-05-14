import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { DataSource, DataSourceOptions } from "typeorm";
import * as dotenv from "dotenv";
dotenv.config();
const isCompiled = __dirname.includes("dist");

const config: DataSourceOptions = {
    type: "postgres",
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT || "5432"),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [isCompiled ? "dist/**/*.entity.js" : "src/**/*.entity.ts"],
    migrations: [isCompiled ? "dist/database/migrations/*.js" : "src/database/migrations/*.ts"],
    synchronize: false,
    logging: ["error", "warn"],
    extra: {
        connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || "30"),
        acquireTimeout: parseInt(process.env.DB_ACQUIRE_TIMEOUT || "10000"),
        timeout: parseInt(process.env.DB_TIMEOUT || "30000"),
        idleTimeout: parseInt(process.env.DB_IDLE_TIMEOUT || "30000"),
    },
    poolSize: parseInt(process.env.DB_POOL_SIZE || "30"),
    // Queries exceeding this threshold surface in logs (["error", "warn"] above).
    maxQueryExecutionTime: parseInt(process.env.DB_MAX_QUERY_EXECUTION_TIME || "3000"),
};

export const typeOrmConfig = (): TypeOrmModuleOptions => config;

export default new DataSource(config);
