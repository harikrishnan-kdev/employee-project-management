import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

const server = express();
let isAppInitialized = false;

async function bootstrap() {
  if (!isAppInitialized) {
    const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
    app.enableCors();
    app.setGlobalPrefix('api'); // Match local prefix
    await app.init();
    isAppInitialized = true;
  }
  return server;
}

export default async (req: any, res: any) => {
  const app = await bootstrap();
  return app(req, res);
};
