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
import { Users } from './user.entity';

@Controller('activities')
export class ActivitiesController {
  constructor(
    @InjectRepository(Activity)
    private activityRepository: Repository<Activity>,
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
  ) {}

  @Get('recent')
  async getRecentActivities(@Query('limit') limit = 20) {
    try {
      // Parse limit to number and ensure it's reasonable
      const parsedLimit = Math.min(
        Math.max(parseInt(limit.toString(), 10) || 20, 1),
        100,
      );

      // This query will fetch activities from all users, sorted by date and ID
      const activities = await this.activityRepository
        .createQueryBuilder('activity')
        .leftJoinAndSelect('activity.user', 'user')
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
        .orderBy('activity.date', 'DESC')
        .addOrderBy('activity.id', 'DESC') // Secondary sort by ID
        .take(parsedLimit)
        .getMany();

      // Transform the result to include username and profilePicture directly in the activity object
      return activities.map((activity) => ({
        id: activity.id,
        activity: activity.activity,
        duration: activity.duration,
        date: activity.date,
        kilometers: activity.kilometers,
        bonus: activity.bonus,
        username: activity.user.username,
        profilePicture: activity.user.profilePicture,
      }));
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      throw new HttpException(
        'Failed to fetch recent activities',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
