import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port') ?? 3000;
  const frontendOrigin =
    configService.get<string>('app.frontendOrigin') ?? 'http://localhost:3001';

  app.use(cookieParser());
  app.enableCors({
    origin: frontendOrigin,
    credentials: true,
  });

  await app.listen(port);
}
void bootstrap();
