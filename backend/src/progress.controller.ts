// src/progress.controller.ts - OPTIMIZED VERSION
import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Delete,
  HttpException,
  HttpStatus,
  Put,
  Query,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './user.entity';
import { Activity } from './activity.entity';
import { calculateKilometersWithBonus } from './activity.utils';

@Controller('users')
export class ProgressController {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    @InjectRepository(Activity)
    private activityRepository: Repository<Activity>,
  ) {}

  // OPTIMIZED: Reduced queries with proper pagination
  @Get(':username')
  async getUser(
    @Param('username') username: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    try {
      // Define interface for raw result
      interface UserCountResult {
        totalActivities: string;
      }

      // Single query to get user with total activity count
      const userWithCount = await this.userRepository
        .createQueryBuilder('user')
        .leftJoin('user.activities', 'activities')
        .where('user.username = :username', { username })
        .select(['user.username', 'user.totalKm', 'user.profilePicture'])
        .addSelect('COUNT(activities.id)', 'totalActivities')
        .groupBy('user.id')
        .getRawAndEntities();

      if (!userWithCount.entities.length) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const user = userWithCount.entities[0];
      const rawResult = userWithCount.raw[0] as UserCountResult;
      const totalActivities = parseInt(rawResult?.totalActivities || '0', 10);

      // Separate optimized query for paginated activities
      const offset = (Number(page) - 1) * Number(limit);
      const activities = await this.activityRepository
        .createQueryBuilder('activity')
        .where(
          'activity.userId = (SELECT id FROM users WHERE username = :username)',
          { username },
        )
        .orderBy('activity.date', 'DESC')
        .addOrderBy('activity.id', 'DESC')
        .limit(Number(limit))
        .offset(offset)
        .getMany();

      const totalPages = Math.ceil(totalActivities / Number(limit));

      return {
        username: user.username,
        totalKm: user.totalKm,
        profilePicture: user.profilePicture,
        activities,
        pagination: {
          total: totalActivities,
          page: Number(page),
          limit: Number(limit),
          totalPages,
        },
      };
    } catch (error) {
      console.error('Error fetching user:', error);
      throw new HttpException(
        'Failed to fetch user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // OPTIMIZED: Batch operation with transaction
  @Post(':username/activities')
  async addActivity(
    @Param('username') username: string,
    @Body() newActivity: Partial<Activity>,
  ) {
    const queryRunner =
      this.userRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Get user with lock to prevent race conditions
      const user = await queryRunner.manager
        .createQueryBuilder()
        .select('user')
        .from(Users, 'user')
        .where('user.username = :username', { username })
        .setLock('pessimistic_write')
        .getOne();

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const hours = (newActivity.duration ?? 0) / 60;
      const adjustedKm = calculateKilometersWithBonus(
        newActivity.activity ?? '',
        hours,
        newActivity.bonus ?? null,
        username,
      );

      // Create activity
      const activity = queryRunner.manager.create(Activity, {
        ...newActivity,
        kilometers: adjustedKm,
        bonus: newActivity.bonus ?? null,
        userId: user.id,
      });

      const savedActivity = await queryRunner.manager.save(activity);

      // Update user's total km
      await queryRunner.manager
        .createQueryBuilder()
        .update(Users)
        .set({ totalKm: () => `totalKm + ${adjustedKm}` })
        .where('id = :id', { id: user.id })
        .execute();

      await queryRunner.commitTransaction();

      return {
        activity: savedActivity,
        user: {
          username: user.username,
          totalKm: user.totalKm + adjustedKm,
        },
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Error adding activity:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // OPTIMIZED: Get all users with activity counts in single query
  @Get()
  async getAllUsers() {
    try {
      // Define interface for raw result
      interface UserActivityCountResult {
        activityCount: string;
      }

      const users = await this.userRepository
        .createQueryBuilder('user')
        .leftJoin('user.activities', 'activities')
        .select([
          'user.id',
          'user.username',
          'user.totalKm',
          'user.profilePicture',
        ])
        .addSelect('COUNT(activities.id)', 'activityCount')
        .groupBy('user.id')
        .orderBy('user.totalKm', 'DESC')
        .getRawAndEntities();

      if (!users.entities.length) {
        throw new HttpException('No users found', HttpStatus.NOT_FOUND);
      }

      // Transform results to include activity count
      return users.entities.map((user, index) => {
        const rawResult = users.raw[index] as UserActivityCountResult;
        return {
          ...user,
          activityCount: parseInt(rawResult?.activityCount || '0', 10),
        };
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new HttpException(
        'Failed to fetch users',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // OPTIMIZED: Get all activities for a user efficiently
  @Get(':username/activities/all')
  async getAllActivities(@Param('username') username: string) {
    try {
      const activities = await this.activityRepository
        .createQueryBuilder('activity')
        .innerJoin('activity.user', 'user')
        .where('user.username = :username', { username })
        .orderBy('activity.date', 'DESC')
        .addOrderBy('activity.id', 'DESC')
        .getMany();

      return activities;
    } catch (error) {
      console.error('Error fetching all activities:', error);
      throw new HttpException(
        'Failed to fetch activities',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // OPTIMIZED: Update activity with transaction
  @Put(':username/activities/:id')
  async updateActivity(
    @Param('username') username: string,
    @Param('id') id: string,
    @Body()
    updateData: {
      activity: string;
      duration: number;
      date: string;
      bonus?: string | null;
    },
  ) {
    const queryRunner =
      this.activityRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const activityId = parseInt(id, 10);

      // Get activity with user in single query
      const activity = await queryRunner.manager
        .createQueryBuilder(Activity, 'activity')
        .innerJoinAndSelect('activity.user', 'user')
        .where('activity.id = :id', { id: activityId })
        .andWhere('user.username = :username', { username })
        .setLock('pessimistic_write')
        .getOne();

      if (!activity) {
        throw new HttpException('Activity not found', HttpStatus.NOT_FOUND);
      }

      const hours = (updateData.duration ?? 0) / 60;
      const adjustedKm = calculateKilometersWithBonus(
        updateData.activity,
        hours,
        updateData.bonus ?? null,
        username,
      );

      const oldKm = activity.kilometers;
      const kmDifference = adjustedKm - oldKm;

      // Update activity
      await queryRunner.manager
        .createQueryBuilder()
        .update(Activity)
        .set({
          activity: updateData.activity,
          duration: updateData.duration,
          date: updateData.date,
          kilometers: adjustedKm,
          bonus: updateData.bonus || null,
        })
        .where('id = :id', { id: activityId })
        .execute();

      // Update user's total km
      await queryRunner.manager
        .createQueryBuilder()
        .update(Users)
        .set({ totalKm: () => `totalKm + ${kmDifference}` })
        .where('id = :id', { id: activity.user.id })
        .execute();

      await queryRunner.commitTransaction();

      return {
        message: 'Activity updated successfully',
        updatedActivity: {
          ...activity,
          ...updateData,
          kilometers: adjustedKm,
        },
        updatedTotalKm: activity.user.totalKm + kmDifference,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Error updating activity:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // OPTIMIZED: Delete activity with transaction
  @Delete(':username/activities/:id')
  async deleteActivity(
    @Param('username') username: string,
    @Param('id') id: string,
  ) {
    const queryRunner =
      this.activityRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const activityId = parseInt(id, 10);

      // Get activity with user in single query
      const activity = await queryRunner.manager
        .createQueryBuilder(Activity, 'activity')
        .innerJoinAndSelect('activity.user', 'user')
        .where('activity.id = :id', { id: activityId })
        .andWhere('user.username = :username', { username })
        .setLock('pessimistic_write')
        .getOne();

      if (!activity) {
        throw new HttpException('Activity not found', HttpStatus.NOT_FOUND);
      }

      const kmToSubtract = activity.kilometers;

      // Delete activity (cascade will handle comments/reactions)
      await queryRunner.manager
        .createQueryBuilder()
        .delete()
        .from(Activity)
        .where('id = :id', { id: activityId })
        .execute();

      // Update user's total km
      await queryRunner.manager
        .createQueryBuilder()
        .update(Users)
        .set({ totalKm: () => `totalKm - ${kmToSubtract}` })
        .where('id = :id', { id: activity.user.id })
        .execute();

      await queryRunner.commitTransaction();

      return {
        message: 'Activity deleted successfully',
        deletedKm: kmToSubtract,
        newTotalKm: activity.user.totalKm - kmToSubtract,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Error deleting activity:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
