// src/activities.controller.ts - OPTIMIZED VERSION
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

      // OPTIMIZED: Single query with proper eager loading and aggregation
      const activities = await this.activityRepository
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
          'user.id',
          'user.username',
          'user.profilePicture',
        ])
        .addSelect('COUNT(DISTINCT reactions.id)', 'reactionsCount')
        .addSelect('COUNT(DISTINCT comments.id)', 'commentsCount')
        .groupBy('activity.id')
        .addGroupBy('user.id')
        .orderBy('activity.date', 'DESC')
        .addOrderBy('activity.id', 'DESC')
        .limit(parsedLimit)
        .getRawAndEntities();

      // Transform the results efficiently
      return activities.entities.map((activity, index): ActivityResponse => {
        const rawData = activities.raw[index] as ActivityRawResult;

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

  // NEW: Get activity details with reactions and comments in one query
  @Get(':id/details')
  async getActivityDetails(@Query('id') activityId: number) {
    try {
      const activity = await this.activityRepository
        .createQueryBuilder('activity')
        .leftJoinAndSelect('activity.user', 'user')
        .leftJoinAndSelect('activity.reactions', 'reactions')
        .leftJoinAndSelect('activity.comments', 'comments')
        .where('activity.id = :id', { id: activityId })
        .getOne();

      if (!activity) {
        throw new HttpException('Activity not found', HttpStatus.NOT_FOUND);
      }

      return {
        ...activity,
        reactionsCount: activity.reactions?.length || 0,
        commentsCount: activity.comments?.length || 0,
      };
    } catch (error) {
      console.error('Error fetching activity details:', error);
      throw new HttpException(
        'Failed to fetch activity details',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
