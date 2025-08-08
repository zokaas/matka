// src/activities.controller.ts
import {
  Controller,
  Get,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from './activity.entity';

// Define interfaces for type safety
interface ActivityRawResult {
  reactionsCount: string;
  commentsCount: string;
}

interface ActivityResponse {
  id: number;
  activity: string;
  duration: number;
  date: string;
  kilometers: number;
  bonus: string | null;
  username: string;
  profilePicture: string | null;
  reactionsCount: number;
  commentsCount: number;
}

@Controller('activities')
export class ActivitiesController {
  constructor(
    @InjectRepository(Activity)
    private activityRepository: Repository<Activity>,
  ) {}

  @Get('recent')
  async getRecentActivities(
    @Query('limit') limit = 20,
  ): Promise<ActivityResponse[]> {
    try {
      const parsedLimit = Math.min(
        Math.max(parseInt(limit.toString(), 10) || 20, 1),
        50,
      );

      // Single optimized query with aggregated counts
      const result = await this.activityRepository
        .createQueryBuilder('activity')
        .leftJoinAndSelect('activity.user', 'user')
        .leftJoin('activity.reactions', 'reactions')
        .leftJoin('activity.comments', 'comments')
        .select([
          'activity.id',
          'activity.activity',
          'activity.duration',
          'activity.date',
          'activity.kilometers',
          'activity.bonus',
          'user.username',
          'user.profilePicture',
        ])
        .addSelect('COUNT(DISTINCT reactions.id)', 'reactionsCount')
        .addSelect('COUNT(DISTINCT comments.id)', 'commentsCount')
        .groupBy('activity.id')
        .addGroupBy('user.id')
        .orderBy('activity.date', 'DESC')
        .addOrderBy('activity.id', 'DESC')
        .take(parsedLimit)
        .getRawAndEntities();

      // Type-safe mapping with proper null checks
      return result.entities.map((activity, index): ActivityResponse => {
        const rawData = result.raw[index] as ActivityRawResult;

        return {
          id: activity.id,
          activity: activity.activity,
          duration: activity.duration,
          date: activity.date,
          kilometers: activity.kilometers,
          bonus: activity.bonus,
          username: activity.user?.username || 'Unknown',
          profilePicture: activity.user?.profilePicture || null,
          reactionsCount: parseInt(rawData?.reactionsCount || '0', 10),
          commentsCount: parseInt(rawData?.commentsCount || '0', 10),
        };
      });
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      throw new HttpException(
        'Failed to fetch recent activities',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
