import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProgressController } from './progress.controller';
import { AppController } from './app.controller';
import { Users } from './user.entity';
import { Activity } from './activity.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL, // Use the environment variable
      entities: [Users, Activity],
      synchronize: true,
      ssl: {
        rejectUnauthorized: false, // Necessary for Render databases
      },
    }),
    TypeOrmModule.forFeature([Users, Activity]),
  ],
  controllers: [ProgressController, AppController],
})
export class AppModule {}
