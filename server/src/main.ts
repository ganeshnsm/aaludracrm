import { NestFactory } from "@nestjs/core";
import { ValidationPipe, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AppModule } from "./app.module";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix("api");

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    app.enableCors({
        origin: true,
        credentials: true,
    });

    const config = app.get(ConfigService);
    const port = parseInt(config.get<string>("PORT") || "8000", 10);

    await app.listen(port);
    Logger.log(`Server running on http://localhost:${port}/api`, "Bootstrap");
}
bootstrap();
