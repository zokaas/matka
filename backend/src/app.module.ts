import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Activity } from './activity.entity';
import { Users } from './user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Load .env globally
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [Users, Activity],
      synchronize: true, // Set to false in production
      ssl: {
        rejectUnauthorized: false, // Required for Supabase
      },
    }),
  ],
})
export class AppModule {}
