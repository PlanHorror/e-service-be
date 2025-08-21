import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      // whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.use(json({ limit: '50mb' })); // Increase JSON body size limit
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
