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
import { Comment } from './comment.entity';
import { Reaction } from './reaction.entity';
import { CommentsController } from './comments.controller';
import { ReactionsController } from './reactions.controller';

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
    TypeOrmModule.forFeature([Users, Activity, Quote, Comment, Reaction]),
  ],
  controllers: [
    AppController,
    ProgressController,
    QuoteController,
    CommentsController,
    ReactionsController,
  ],
  providers: [AppService],
})
export class AppModule {}
