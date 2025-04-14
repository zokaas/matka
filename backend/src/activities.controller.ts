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

interface ActivityWithUser extends Omit<Activity, 'user'> {
  username: string;
  profilePicture?: string;
}

@Controller('activities')
export class ActivitiesController {
  constructor(
    @InjectRepository(Activity)
    private activityRepository: Repository<Activity>,
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
  ) {}

  @Get('recent')
  async getRecentActivities(
    @Query('limit') limit = 20,
  ): Promise<ActivityWithUser[]> {
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
          'activity.userId',
          'user.username',
          'user.profilePicture',
        ])
        .orderBy('activity.date', 'DESC')
        .addOrderBy('activity.id', 'DESC') // Secondary sort by ID
        .take(parsedLimit)
        .getMany();

      // Transform the result to maintain type consistency
      return activities.map((activity) => ({
        id: activity.id,
        activity: activity.activity,
        duration: activity.duration,
        date: activity.date,
        kilometers: activity.kilometers,
        bonus: activity.bonus,
        userId: activity.userId,
        username: activity.user.username,
        profilePicture: activity.user.profilePicture,
        comments: activity.comments || [], // Ensure comments are included
        reactions: activity.reactions || [], // Ensure reactions are included
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
