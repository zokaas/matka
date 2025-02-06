import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Load environment variables
  const DATABASE_URL = configService.get<string>('DATABASE_URL');
  const PORT = configService.get<number>('PORT') || 3000;

  // Ensure the DATABASE_URL is provided
  if (!DATABASE_URL) {
    throw new Error('❌ Missing DATABASE_URL in .env file!');
  }

  // Enable CORS for frontend communication
  app.enableCors({
    origin: '*', // Replace with frontend URL for security
  });

  // Start the server
  await app.listen(PORT);
  Logger.log(`🚀 Backend running at: http://localhost:${PORT}`);
}

bootstrap();
