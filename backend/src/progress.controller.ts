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

  // ✅ GET: Fetch a user and paginate activities
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

    user.activities.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    const start = (Number(page) - 1) * Number(limit);
    const paginatedActivities = user.activities.slice(
      start,
      start + Number(limit),
    );

    return {
      username: user.username,
      totalKm: user.totalKm,
      profilePicture: user.profilePicture,
      activities: paginatedActivities,
      pagination: {
        total: user.activities.length,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(user.activities.length / Number(limit)),
      },
    };
  }

  // ✅ POST: Add a new user
  @Post()
  async addUser(@Body() newUser: { username: string; totalKm?: number }) {
    const existingUser = await this.userRepository.findOne({
      where: { username: newUser.username },
    });

    if (existingUser) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const user = this.userRepository.create({
      username: newUser.username,
      totalKm: newUser.totalKm ?? 0,
    });

    await this.userRepository.save(user);
    return user;
  }

  // ✅ GET: Fetch all users
  @Get()
  async getAllUsers() {
    const users = await this.userRepository.find({ relations: ['activities'] });
    if (!users.length) {
      throw new HttpException('No users found', HttpStatus.NOT_FOUND);
    }
    return users;
  }

  @Post(':username/activities')
  async addActivity(
    @Param('username') username: string,
    @Body() newActivity: Partial<Activity>,
  ) {
    process.stdout.write(
      JSON.stringify({
        msg: 'Debug log',
        activity: newActivity,
        username,
      }) + '\n',
    );
    const user = await this.userRepository.findOne({
      where: { username },
      relations: ['activities'],
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    console.log('Activity received:', newActivity);

    const hours = (newActivity.duration ?? 0) / 60;
    const adjustedKm = calculateKilometersWithBonus(
      newActivity.activity ?? '',
      hours,
      newActivity.bonus ?? null,
    );

    console.log('Adjusted Kilometers:', adjustedKm);

    const activity = this.activityRepository.create({
      ...newActivity,
      kilometers: adjustedKm,
      bonus: newActivity.bonus ?? null,
      user,
    });

    const savedActivity = await this.activityRepository.save(activity);

    user.activities = [...user.activities, savedActivity];
    user.totalKm = user.totalKm + savedActivity.kilometers;
    await this.userRepository.save(user);
    console.log('Final kilometers:', adjustedKm);
    console.log('================END================');
    return {
      activity: savedActivity,
      user: {
        username: user.username,
        totalKm: user.totalKm,
        activities: user.activities,
      },
    };
  }

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
    const user = await this.userRepository.findOne({
      where: { username },
      relations: ['activities'],
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const activityId = parseInt(id, 10);
    const activity = await this.activityRepository.findOne({
      where: { id: activityId, user: { username } },
    });

    if (!activity) {
      throw new HttpException('Activity not found', HttpStatus.NOT_FOUND);
    }

    console.log('Updating Activity:', updateData);

    // Extract "Muu(100km/h)" or "Muu(50km/h)" even if a custom name is added
    const match = updateData.activity.match(/Muu\(.*?\)/);
    const activityType = match ? match[0] : updateData.activity.trim();

    const hours = (updateData.duration ?? 0) / 60;
    const adjustedKm = calculateKilometersWithBonus(
      activityType, // ✅ Extracted correct activity type
      hours,
      updateData.bonus ?? null,
    );

    // Remove old kilometers before updating
    user.totalKm -= activity.kilometers;

    // Update activity properties
    activity.activity = updateData.activity; // ✅ Keeps full name e.g., "Custom Name / Muu(100km/h)"
    activity.duration = updateData.duration;
    activity.date = updateData.date;
    activity.kilometers = adjustedKm;
    activity.bonus = updateData.bonus || null;

    // Save updated activity
    await this.activityRepository.save(activity);

    // Recalculate user's total kilometers correctly
    user.totalKm += adjustedKm;
    await this.userRepository.save(user);

    return {
      message: 'Activity updated successfully',
      updatedActivity: activity,
      updatedTotalKm: user.totalKm,
    };
  }

  // ✅ DELETE: Delete an activity by **ID**
  @Delete(':username/activities/:id')
  async deleteActivity(
    @Param('username') username: string,
    @Param('id') id: string, // String because Nest treats route params as strings
  ) {
    const user = await this.userRepository.findOne({
      where: { username },
      relations: ['activities'],
    });

    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const activityId = parseInt(id, 10);
    const activity = await this.activityRepository.findOne({
      where: { id: activityId },
    });

    if (!activity)
      throw new HttpException('Activity not found', HttpStatus.NOT_FOUND);

    user.activities = user.activities.filter((a) => a.id !== activity.id);
    user.totalKm = user.activities.reduce(
      (total, a) => total + a.kilometers,
      0,
    );

    await this.activityRepository.delete(activity.id);
    await this.userRepository.save(user);

    return user;
  }
}
