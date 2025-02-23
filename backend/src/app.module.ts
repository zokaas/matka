import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Users } from './user.entity';
import { Activity } from './activity.entity';
import { ProgressController } from './progress.controller';
import { Quote } from './quote.entity';
import { QuoteController } from './quote.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: true,
        logging: true,
        logger: 'advanced-console', // Set to false in production
        ssl: {
          rejectUnauthorized: false, // Required for Neon.tech
        },
      }),
    }),
    TypeOrmModule.forFeature([Users, Activity, Quote]),
  ],
  controllers: [AppController, ProgressController, QuoteController], // Ensure your controllers are registered
  providers: [AppService],
})
export class AppModule {}
