// src/app.module.ts
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
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'fitness_challenge',
      entities: [Users, Activity],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Users, Activity]),
  ],
  controllers: [ProgressController, AppController],
})
export class AppModule {}
