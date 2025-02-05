// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS if needed for frontend communication
  app.enableCors({
    origin: 'http://localhost:3000', // Adjust as per your frontend app
    credentials: true,
  });

  await app.listen(5001);
}
bootstrap();
