import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'node:path';
import express from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.getHttpAdapter().getInstance().use('/uploads', express.static(join(process.cwd(), 'uploads')));
  app.enableCors({ origin: process.env.CLIENT_URL || '*', credentials: true });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle('Movie Booking API')
    .setDescription('API đồ án Movie viết bằng NestJS và Prisma')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'bearerAuth')
    .build();
  SwaggerModule.setup('api/docs', app, () => SwaggerModule.createDocument(app, config));

  await app.listen(Number(process.env.PORT || 3069));
}

bootstrap();
