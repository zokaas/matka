import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Load environment variables
  const DATABASE_URL = configService.get<string>('DATABASE_URL');
  const PORT = configService.get<number>('PORT') || 5001;

  // Ensure the DATABASE_URL is provided
  if (!DATABASE_URL) {
    throw new Error('❌ Missing DATABASE_URL in .env file!');
  }

  // Enable CORS for frontend communication
  app.enableCors({
    origin: '*', // Replace with frontend URL for security
  });

    app
      .getHttpAdapter()
      .get('/health', (req, res) => res.send('Backend is healthy!'));
      
  // Start the server
  await app.listen(PORT);
  app.use((req, res, next) => {
    process.stdout.write(`${req.method} ${req.url}\n`);
    if (req.body) {
      process.stdout.write(`Body: ${JSON.stringify(req.body)}\n`);
    }
    next();
  });
  Logger.log(`🚀 Backend running at: http://localhost:${PORT}`);
}

bootstrap();
