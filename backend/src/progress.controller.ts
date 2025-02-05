// src/progress.controller.ts
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

@Controller('users') // Ensure this matches the route
export class ProgressController {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    @InjectRepository(Activity)
    private activityRepository: Repository<Activity>,
  ) {}

  // GET: Fetch user
  @Get(':username')
  async getUser(
    @Param('username') username: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    const user = await this.userRepository.findOne({
      where: { username },
      relations: ['activities'],
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const start = (Number(page) - 1) * Number(limit);
    const paginatedActivities = user.activities.slice(
      start,
      start + Number(limit),
    );

    return {
      username: user.username,
      totalKm: user.totalKm,
      activities: paginatedActivities,
      pagination: {
        total: user.activities.length,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(user.activities.length / Number(limit)),
      },
    };
  }
  @Post() // POST route to add a new user
  async addUser(@Body() newUser: { username: string; totalKm: number }) {
    const existingUser = await this.userRepository.findOne({
      where: { username: newUser.username },
    });

    if (existingUser) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const user = this.userRepository.create(newUser);
    await this.userRepository.save(user);

    return user;
  }

  // GET: Fetch all users
  @Get()
  async getAllUsers() {
    const users = await this.userRepository.find({ relations: ['activities'] });
    if (!users) {
      throw new HttpException('No users found', HttpStatus.NOT_FOUND);
    }
    return users;
  }
  // POST: Add activity to a user
  @Post(':username/activities')
  async addActivity(
    @Param('username') username: string,
    @Body() newActivity: Partial<Activity>,
  ) {
    const user = await this.userRepository.findOne({
      where: { username },
      relations: ['activities'],
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const activity = this.activityRepository.create({
      ...newActivity,
      user,
    });

    const savedActivity = await this.activityRepository.save(activity);

    // Update user's activities and totalKm
    user.activities = [...user.activities, savedActivity];
    user.totalKm = user.totalKm + savedActivity.kilometers;
    await this.userRepository.save(user);

    return {
      activity: savedActivity,
      user: {
        username: user.username,
        totalKm: user.totalKm,
        activities: user.activities,
      },
    };
  }

  // DELETE: Delete an activity
  @Delete(':username/activities/:index')
  async deleteActivity(
    @Param('username') username: string,
    @Param('index') index: string,
  ) {
    const user = await this.userRepository.findOne({
      where: { username },
      relations: ['activities'],
    });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const activityIndex = parseInt(index, 10);
    const activity = user.activities[activityIndex];

    if (!activity)
      throw new HttpException('Activity not found', HttpStatus.NOT_FOUND);

    user.activities.splice(activityIndex, 1);
    user.totalKm -= activity.kilometers;

    await this.activityRepository.delete(activity.id);
    await this.userRepository.save(user);

    return user;
  }

  @Put(':username/activities/:index')
  async updateActivity(
    @Param('username') username: string,
    @Param('index') index: string,
    @Body()
    updateData: {
      activity: string;
      duration: number;
      date: string;
      kilometers: number;
    },
  ) {
    const user = await this.userRepository.findOne({
      where: { username },
      relations: ['activities'],
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const activityIndex = parseInt(index, 10); // Convert to number
    console.log(`Activity index: ${activityIndex}`, user.activities); // Log activities to check

    if (
      isNaN(activityIndex) ||
      activityIndex < 0 ||
      activityIndex >= user.activities.length
    ) {
      throw new HttpException('Invalid activity index', HttpStatus.BAD_REQUEST);
    }

    const updatedActivity = user.activities[activityIndex];
    updatedActivity.activity = updateData.activity;
    updatedActivity.duration = updateData.duration;
    updatedActivity.date = updateData.date;
    updatedActivity.kilometers = updateData.kilometers;

    await this.activityRepository.save(updatedActivity); // Save updated activity
    user.totalKm = user.activities.reduce(
      (total, activity) => total + activity.kilometers,
      0,
    ); // Update totalKm by summing up the activity kilometers
    await this.userRepository.save(user); // Save the user with updated totalKm

    return {
      message: 'Activity updated successfully',
      user,
    };
  }
}
